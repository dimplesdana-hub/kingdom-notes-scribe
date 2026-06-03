import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Returns a short-lived AssemblyAI realtime token for the browser to use.
export const getAssemblyAiToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) throw new Error("ASSEMBLYAI_API_KEY not configured");

    const res = await fetch(
      "https://api.assemblyai.com/v2/realtime/token?expires_in=3600",
      { method: "POST", headers: { authorization: apiKey } }
    );
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`AssemblyAI token error ${res.status}: ${txt}`);
    }
    const json = (await res.json()) as { token: string };
    return { token: json.token };
  });
