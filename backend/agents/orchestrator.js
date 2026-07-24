const AGENT_KEYWORDS = {
  inventory: ['stock', 'inventory', 'reorder', 're-order', 'depletion', 'out of', 'low on', 'restock', 'buy more'],
  finance: ['cash', 'budget', 'afford', 'money', 'expense', 'profit', 'payment'],
  sales: ['sales', 'sell', 'demand', 'trend', 'forecast', 'popular', 'velocity'],
  gst: ['gst', 'tax', 'invoice', 'taxable'],
  support: ['customer', 'whatsapp', 'message', 'reminder', 'order ready', 'due'],
};

const ORDER = ['sales', 'inventory', 'finance', 'gst', 'support'];

export function orchestrateQuery({ query } = {}) {
  if (typeof query !== 'string' || !query.trim()) {
    return {
      finding: 'A non-empty business query is required.',
      recommendation: 'Ask a question about stock, sales, cash, GST, or customers.',
      confidence: 1,
      reasoning: ['The query was missing or blank.'],
      agents_to_call: [],
    };
  }

  const normalizedQuery = query.toLowerCase();
  const selectedAgents = Object.entries(AGENT_KEYWORDS)
    .filter(([, keywords]) => keywords.some((keyword) => normalizedQuery.includes(keyword)))
    .map(([agent]) => agent);

  const agentsToCall = (selectedAgents.length ? selectedAgents : ['sales', 'inventory'])
    .sort((left, right) => ORDER.indexOf(left) - ORDER.indexOf(right));
  const usedFallback = selectedAgents.length === 0;

  return {
    finding: `Identified ${agentsToCall.join(', ')} as the relevant agent${agentsToCall.length > 1 ? 's' : ''}.`,
    recommendation: `Run ${agentsToCall.join(' → ')} in that order.`,
    confidence: usedFallback ? 0.45 : 0.9,
    reasoning: [
      usedFallback
        ? 'No specialist keywords matched, so sales and inventory provide a safe general business overview.'
        : `Matched business keywords for: ${selectedAgents.join(', ')}.`,
      'Sales is ordered before Inventory because demand context can affect a reorder recommendation.',
    ],
    agents_to_call: agentsToCall,
  };
}
