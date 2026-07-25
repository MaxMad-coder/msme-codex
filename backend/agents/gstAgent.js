export function analyzeGST({ amount = 0, category = 'General' } = {}) {
  if (!Number.isFinite(amount) || amount < 0) {
    return {
      finding: 'Invalid transaction amount.',
      recommendation: 'Provide a valid positive amount in INR to calculate GST.',
      confidence: 1,
      reasoning: ['GST calculation requires a valid numeric amount.'],
    };
  }

  const normalizedCategory = String(category).toLowerCase();
  let rate = 0.05;

  if (/luxury|oil|spice|beverage|cosmetic|electronics|misc|tea|coffee|snack/.test(normalizedCategory)) {
    rate = 0.18;
  } else if (/rice|pulses|staples|dairy|salt|flour|bread|vegetable|fruits/.test(normalizedCategory)) {
    rate = 0.05;
  } else if (/general|other/.test(normalizedCategory)) {
    rate = 0.12;
  }

  const tax = Number((amount * rate).toFixed(2));
  return {
    finding: `Assumed GST rate for ${category} is ${Math.round(rate * 100)}%.`, 
    recommendation: `GST on ₹${amount.toFixed(2)} is ₹${tax.toFixed(2)}.`,
    confidence: 0.8,
    reasoning: [
      `Using ${Math.round(rate * 100)}% GST for category '${category}'.`, 
      `Tax amount is ₹${tax.toFixed(2)} for the transaction total of ₹${amount.toFixed(2)}.`, 
    ],
  };
}
