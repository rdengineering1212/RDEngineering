// ─── WhatsApp Business Cloud API ─────────────────────────────────────────────
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages/text-messages

const WA_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WA_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WA_RECIPIENT = process.env.WHATSAPP_ADMIN_RECIPIENT_NUMBER || "918883389766";

// Check configuration at module level
const isWhatsAppConfigured =
  !!WA_ACCESS_TOKEN &&
  WA_ACCESS_TOKEN !== "your_meta_whatsapp_access_token" &&
  !!WA_PHONE_NUMBER_ID &&
  WA_PHONE_NUMBER_ID !== "your_whatsapp_phone_number_id";

if (!isWhatsAppConfigured) {
  console.warn(
    "[WhatsApp] ⚠️  NOT CONFIGURED. To enable WhatsApp notifications you need:\n" +
    "  • WHATSAPP_ACCESS_TOKEN  — from Meta Business Suite → WhatsApp → API Setup\n" +
    "  • WHATSAPP_PHONE_NUMBER_ID — from Meta Business Suite → WhatsApp → API Setup\n" +
    "  • WHATSAPP_ADMIN_RECIPIENT_NUMBER — defaults to 918883389766\n" +
    "  Signup: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
  );
} else {
  console.log(`[WhatsApp] ✅ Configured. Will send to: ${WA_RECIPIENT} via phone_number_id: ${WA_PHONE_NUMBER_ID}`);
}

type WhatsAppResult = { success: boolean; error?: string };

export async function sendWhatsAppAdminNotification(text: string): Promise<WhatsAppResult> {
  if (!isWhatsAppConfigured) {
    console.log("[WhatsApp] Skipping — credentials not configured.");
    return { success: false, error: "WhatsApp credentials not configured" };
  }

  const url = `https://graph.facebook.com/v20.0/${WA_PHONE_NUMBER_ID}/messages`;

  try {
    console.log(`[WhatsApp] Sending to ${WA_RECIPIENT}...`);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: WA_RECIPIENT,
        type: "text",
        text: {
          preview_url: false,
          body: text,
        },
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg = (data as any)?.error?.message || `HTTP ${response.status}`;
      console.error(`[WhatsApp] ❌ Failed: ${errMsg}`);
      return { success: false, error: errMsg };
    }

    const msgId = (data as any)?.messages?.[0]?.id;
    console.log(`[WhatsApp] ✅ Sent successfully. Message ID: ${msgId}`);
    return { success: true };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.error(`[WhatsApp] ❌ Network error: ${errMsg}`);
    return { success: false, error: errMsg };
  }
}
