export function draftSupportMessage({ customerName = 'Customer', situation = 'general', language = 'en' } = {}) {
  const name = customerName.trim() || 'Customer';
  const normalized = String(situation).toLowerCase();

  const templates = {
    payment_due: {
      en: `Hi ${name}, this is a friendly reminder that your payment is due. Please settle the balance at your earliest convenience. Thank you!`,
      hi: `Namaste ${name}, aapki bhugtan ki rashi abhi bhi baki hai. Kripya jaldi se bhugtan karen. Dhanyavaad!`,
    },
    order_ready: {
      en: `Hello ${name}, your order is ready for pickup. Please visit the shop whenever convenient. Thank you for shopping with us!`,
      hi: `Namaste ${name}, aapka order tayar hai. Kripya jab suvidha ho tab dukan par aakar le jayein. Dhanyavaad!`,
    },
    thank_you: {
      en: `Thank you ${name} for your purchase. We appreciate your trust and look forward to serving you again.`, 
      hi: `Dhanyavaad ${name} aapki kharidari ke liye. Hum aapko phir se seva dene ke liye utsahit hain.`,
    },
    general: {
      en: `Hi ${name}, how can I help you today? Send me your question about stock, sales, or payments.`, 
      hi: `Namaste ${name}, main aaj aapki kaise madad kar sakta hoon? Kripya apna prashn bhejein.`,
    },
  };

  const template = templates[normalized] || templates.general;
  const message = language === 'hi' ? template.hi : template.en;

  return {
    finding: `Prepared a ${normalized === 'general' ? 'general' : normalized.replace('_', ' ')} customer message.`, 
    recommendation: message,
    confidence: 0.9,
    reasoning: [`Selected the '${normalized}' message template for ${name}.`, `Language set to ${language === 'hi' ? 'Hindi' : 'English'}.`],
  };
}
