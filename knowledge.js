// Wardrobe MFG — chatbot knowledge base
// Business facts the bot uses to answer customers (edit freely)

module.exports = {
  business: {
    name: "Wardrobe MFG",
    type: "Custom apparel factory (Sialkot, Pakistan)",
    tagline: "Custom bulk apparel manufacturing — worldwide shipping",
  },

  // Core facts (keep in sync with Instagram bio / website)
  facts: {
    moq: "30 pieces",
    timeline: "12–15 days",
    shipping: "worldwide",
    location: "Sialkot, Pakistan",
  },

  products: [
    "Hoodies",
    "T-shirts",
    "Sweatshirts",
    "Jackets",
    "Tracksuits",
    "Shorts",
    "Custom streetwear & private-label apparel",
  ],

  // Intent → reply. The bot matches keywords, then falls back to AI / human handoff.
  intents: [
    {
      name: "greeting",
      keywords: ["hi", "hello", "hey", "salam", "assalam", "aoa", "good morning", "good evening"],
      reply:
        "Hello! Welcome to Wardrobe MFG — custom apparel factory in Sialkot, Pakistan. " +
        "We manufacture hoodies, t-shirts, sweatshirts, jackets, tracksuits & more for brands worldwide.\n\n" +
        "How can I help you today?\n" +
        "1️⃣ Get a price quote\n" +
        "2️⃣ Know our MOQ & delivery time\n" +
        "3️⃣ See product options\n" +
        "4️⃣ Talk to a human",
    },
    {
      name: "price",
      keywords: ["price", "cost", "quote", "quotation", "rate", "rates", "how much", "pricing", "paisay", "keemat"],
      reply:
        "Pricing depends on the product, fabric, design/print work, and quantity — so I’ll need a few details for an exact quote:\n\n" +
        "• Product type (e.g. hoodie, t-shirt)\n" +
        "• Quantity (MOQ is 30 pieces)\n" +
        "• Sizes & colors\n" +
        "• Design / tech pack or reference picture (if you have one)\n\n" +
        "Send these details here and our team will reply with a quote. " +
        "Or type HUMAN and I’ll connect you to our team right away.",
    },
    {
      name: "moq",
      keywords: ["moq", "minimum", "minimum order", "least order", "kitne piece", "minimum quantity"],
      reply:
        "Our minimum order quantity (MOQ) is 30 pieces per design. " +
        "You can mix sizes within those 30 pieces.",
    },
    {
      name: "delivery",
      keywords: ["delivery", "time", "long", "days", "shipping time", "kitne din", "timeline", "lead time", "dispatch"],
      reply:
        "Standard production time is 12–15 days after design approval, and we ship worldwide from Sialkot, Pakistan. " +
        "Shipping time depends on your country and courier choice.",
    },
    {
      name: "products",
      keywords: ["product", "products", "what do you make", "services", "items", "catalogue", "catalog", "kya banatay"],
      reply:
        "We manufacture:\n" +
        "• Hoodies\n" +
        "• T-shirts\n" +
        "• Sweatshirts\n" +
        "• Jackets\n" +
        "• Tracksuits\n" +
        "• Shorts\n" +
        "• Custom streetwear & private-label apparel\n\n" +
        "All fully customizable — fabric, fit, colors, printing, embroidery, labels & packaging.",
    },
    {
      name: "order",
      keywords: ["order", "buy", "purchase", "book", "start", "i want"],
      reply:
        "Great! Here’s how ordering works:\n\n" +
        "1️⃣ Share product type, quantity (min 30 pcs), sizes & design\n" +
        "2️⃣ We send you a quote\n" +
        "3️⃣ You approve → we start production (12–15 days)\n" +
        "4️⃣ Quality check → worldwide shipping\n\n" +
        "Send your details here to begin, or type HUMAN to talk to our team.",
    },
    {
      name: "sample",
      keywords: ["sample", "sampling"],
      reply:
        "Yes, we can arrange a sample before bulk production so you can check quality, fit and fabric. " +
        "Share your product details and our team will guide you on sample cost and time.",
    },
    {
      name: "shipping",
      keywords: ["ship", "shipping", "deliver to", "country", "worldwide", "courier", "dhl", "fedex"],
      reply:
        "We ship worldwide from Sialkot, Pakistan via international couriers. " +
        "Tell us your country/city and quantity and we’ll include the best shipping option in your quote.",
    },
    {
      name: "human",
      keywords: ["human", "agent", "person", "real", "call", "number", "contact", "owner", "talk to someone"],
      reply:
        "Of course — I’ve noted that you’d like to speak with our team. " +
        "Please share your name and what it’s about, and a team member will reply here shortly. Thank you!",
      handoff: true,
    },
    {
      name: "thanks",
      keywords: ["thank", "thanks", "shukriya", "ok", "okay", "great", "nice"],
      reply:
        "You’re welcome! If you need a quote or have any other question about custom manufacturing, just message here anytime.",
    },
  ],

  fallbackReply:
    "Thanks for your message! I want to make sure you get the right answer — " +
    "could you tell me a little more? I can help with price quotes, MOQ (30 pcs), " +
    "delivery time (12–15 days), products, or placing an order. " +
    "Or type HUMAN to talk to our team directly.",
};
