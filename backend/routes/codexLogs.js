import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const logPath = path.resolve('./codex-logs/CODEX_LOG.md');

function parseCodexLog(markdown) {
  const sections = markdown.split(/^##\s+/m).slice(1);
  return sections.map((section) => {
    const [header, ...bodyLines] = section.split('\n');
    const content = bodyLines.join('\n').trim();
    const block = {
      session: header.trim(),
      goal: '',
      planning: [],
      generation: [],
      selfReview: [],
      testing: [],
      deployment: [],
      status: '',
    };

    const sectionsMap = {
      'Planning:': 'planning',
      'Generation:': 'generation',
      'Self-Review:': 'selfReview',
      'Testing:': 'testing',
      'Deployment:': 'deployment',
      'Status:': 'status',
    };

    let current = null;
    content.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const sectionHeader = Object.keys(sectionsMap).find((key) => trimmed.startsWith(key));
      if (sectionHeader) {
        current = sectionsMap[sectionHeader];
        const remainder = trimmed.slice(sectionHeader.length).trim();
        if (current === 'status') {
          block.status = remainder;
        } else if (remainder) {
          block[current].push(remainder.replace(/^[-*]\s+/, '').trim());
        }
        return;
      }

      if (!current) {
        if (trimmed.startsWith('**Goal:**')) {
          block.goal = trimmed.replace('**Goal:**', '').trim();
        }
        return;
      }

      if (current !== 'status') {
        block[current].push(trimmed.replace(/^[-*]\s+/, '').trim());
      }
    });

    return block;
  });
}

router.get('/codex-logs', async (_req, res) => {
  try {
    const markdown = await fs.readFile(logPath, 'utf-8');
    const parsed = parseCodexLog(markdown);
    res.json({ entries: parsed });
  } catch (error) {
    console.error('Failed to read codex log:', error);
    res.status(500).json({ error: 'Unable to read Codex log.' });
  }
});

export default router;
