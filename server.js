// Wardrobe MFG — WhatsApp Cloud API webhook server
// Setup: copy .env.example to .env, fill values, then: npm install && npm start
//
// Webhook endpoints:
//   GET  /webhook  -> Meta verification (hub.mode / hub.verify_token / hub.challenge)
//   POST /webhook  -> incoming messages -> bot reply -> send via Cloud API

const fs = require("fs");
const path = require("path");
// Minimal .env loader (no extra dependency): reads KEY=VALUE lines from ./.env
try {
  const envPath = path.join(__dirname, ".env");
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { /* no .env file — rely on real environment variables */ }

const express = require("express");
const { getReply } = require("./bot");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "wardrobe-verify-token";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // permanent (system user) or temporary token
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || "v21.0";
const PORT = process.env.PORT || 3000;

// --- 1) Webhook verification (Meta calls this once when you save the callback URL) ---
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified OK");
    return res.status(200).send(challenge);
  }
  console.warn("Webhook verification failed");
  return res.sendStatus(403);
});

// --- 2) Incoming messages ---
app.post("/webhook", async (req, res) => {
  // Acknowledge immediately so Meta doesn't retry
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    if (!value || change.field !== "messages") return;

    const message = value.messages?.[0];
    if (!message || message.type !== "text") return; // text-only bot (extend as needed)

    const from = message.from; // sender's WhatsApp number
    const text = message.text?.body || "";
    console.log(`Incoming from ${from}: ${text}`);

    const { reply, handoff } = await getReply(text);
    if (handoff) {
      console.log(`HANDOFF requested by ${from} — notify the team!`);
      // TODO: forward to team (email/CRM/notification) as needed
    }

    await sendWhatsAppMessage(from, reply);
  } catch (err) {
    console.error("Webhook handling error:", err.message);
  }
});

// --- 3) Send a text message via Cloud API ---
async function sendWhatsAppMessage(to, text) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("Missing WHATSAPP_TOKEN or PHONE_NUMBER_ID — message NOT sent:", text);
    return;
  }
  const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
  if (!res.ok) {
    console.error("Send message failed:", res.status, await res.text());
  } else {
    console.log(`Reply sent to ${to}`);
  }
}

app.get("/", (req, res) => res.send("Wardrobe MFG WhatsApp bot is running."));
app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`WhatsApp bot listening on port ${PORT}`);
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.warn("WARNING: WHATSAPP_TOKEN / PHONE_NUMBER_ID not set — check your .env");
  }
});
