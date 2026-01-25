import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;

  // Handle Notion webhook verification
  // Notion sends { verification_token: "secret_xxx" } when setting up the webhook
  // Copy this token from Vercel logs and paste it in Notion's verification form
  if (body?.verification_token) {
    console.log("===========================================");
    console.log("NOTION WEBHOOK VERIFICATION TOKEN:");
    console.log(body.verification_token);
    console.log("===========================================");
    return res.status(200).json({ success: true });
  }

  // Log the webhook event
  console.log("Notion webhook received:", body?.type || "unknown");

  // Trigger Vercel rebuild for content update events
  const deployHook = process.env.VERCEL_DEPLOY_HOOK;
  if (deployHook) {
    try {
      const response = await fetch(deployHook, { method: "POST" });
      if (!response.ok) {
        console.error("Failed to trigger Vercel deploy:", response.status);
        return res.status(500).json({ error: "Failed to trigger deploy" });
      }
      console.log("Vercel rebuild triggered successfully");
    } catch (error) {
      console.error("Error triggering Vercel deploy:", error);
      return res.status(500).json({ error: "Failed to trigger deploy" });
    }
  } else {
    console.warn("VERCEL_DEPLOY_HOOK not configured");
  }

  return res.status(200).json({ success: true });
}
