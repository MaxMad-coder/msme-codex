export function synthesizeRecommendations({ agents_outputs = [] } = {}) {
  if (!Array.isArray(agents_outputs) || agents_outputs.length === 0) {
    return {
      final_answer: 'No agent outputs available to synthesize a recommendation.',
      confidence: 0,
      reasoning_chain: [],
    };
  }

  const validOutputs = agents_outputs.filter((output) => output && typeof output === 'object');
  const averageConfidence = validOutputs.length
    ? validOutputs.reduce((sum, output) => sum + (Number.isFinite(output.confidence) ? output.confidence : 0), 0) / validOutputs.length
    : 0;

  const mergedFindings = validOutputs.map((output) => output.finding).filter(Boolean).join(' ');
  const mergedRecommendations = validOutputs.map((output) => output.recommendation).filter(Boolean).join(' ');

  return {
    final_answer: `${mergedFindings} ${mergedRecommendations}`.trim() || 'The agents were unable to generate a recommendation.',
    confidence: Number(averageConfidence.toFixed(2)),
    reasoning_chain: validOutputs.map((output) => ({
      agent: output.agent || 'unknown',
      finding: output.finding,
      recommendation: output.recommendation,
      confidence: output.confidence,
      reasoning: output.reasoning,
    })),
  };
}
