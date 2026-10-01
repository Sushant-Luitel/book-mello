import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseBody } from "@/lib/api";

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
export async function POST(request: Request) {
  const parsed = await parseBody(request, schema); if (parsed.response) return parsed.response;
  const supabase = await createClient(); const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  return NextResponse.json({ user: data.user });
}
