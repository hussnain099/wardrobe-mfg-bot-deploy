// Wardrobe MFG — chatbot reply engine
// 1) matches keywords from knowledge.js intents
// 2) optionally calls an AI API (OpenAI-compatible) for anything unmatched
// 3) falls back to the default fallback reply

const knowledge = require("./knowledge");

const SYSTEM_PROMPT = `You are the WhatsApp assistant for ${knowledge.business.name}, a ${knowledge.business.type}.
Key facts (always be consistent with these):
- Minimum order quantity (MOQ): ${knowledge.facts.moq} per design (sizes can be mixed)
- Production time: ${knowledge.facts.timeline} after design approval
- Shipping: ${knowledge.facts.shipping}, from ${knowledge.facts.location}
- Products: ${knowledge.products.join(", ")}
- Pricing depends on product, fabric, design/print, quantity — never invent a fixed price. Ask for product type, quantity, sizes, colors, and design to prepare a quote.
- Ordering steps: share details → quote → approval → production (12-15 days) → QC → shipping.
Style: friendly, short WhatsApp-style messages (under 60 words usually), English (customer language). Use simple formatting, no markdown headers. If unsure, say the team will confirm. Never claim to be human.`;

function normalize(text) {
  return (text || "").toLowerCase().trim();
}

// Keyword intent matching.
// Short keywords (<=3 chars) match on word boundaries so "hi" doesn't
// fire inside "ship"/"this"; longer phrases use substring matching.
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchIntent(text) {
  const t = normalize(text);
  if (!t) return null;
  for (const intent of knowledge.intents) {
    const hit = intent.keywords.some((kw) => {
      const k = kw.toLowerCase().trim();
      if (k.length <= 3) {
        return new RegExp(`\\b${escapeRegExp(k)}\\b`).test(t);
      }
      return t.includes(k);
    });
    if (hit) return intent;
  }
  return null;
}

// Optional AI upgrade: any OpenAI-compatible chat completions endpoint.
// Set AI_API_KEY + (optionally) AI_API_URL + AI_MODEL in .env to enable.
async function aiReply(userText) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return null;
  const url = process.env.AI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL || "gpt-4o-mini";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userText },
        ],
        max_tokens: 300,
        temperature: 0.6,
      }),
    });
    if (!res.ok) {
      console.error("AI API error:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    return reply || null;
  } catch (err) {
    console.error("AI request failed:", err.message);
    return null;
  }
}

// Main entry: returns { reply, handoff }
async function getReply(userText) {
  const intent = matchIntent(userText);
  if (intent) {
    return { reply: intent.reply, handoff: !!intent.handoff };
  }
  const ai = await aiReply(userText);
  if (ai) return { reply: ai, handoff: false };
  return { reply: knowledge.fallbackReply, handoff: false };
}

module.exports = { getReply, matchIntent, SYSTEM_PROMPT };
