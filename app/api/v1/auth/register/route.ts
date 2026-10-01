import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { parseBody } from "@/lib/api";

const schema = z.object({ email: z.string().email(), password: z.string().min(8), full_name: z.string().min(1).max(120) });
export async function POST(request: Request) {
  const parsed = await parseBody(request, schema); if (parsed.response) return parsed.response;
  const supabase = await createClient(); const { data, error } = await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password, options: { data: { full_name: parsed.data.full_name } } });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ user: data.user, session: data.session }, { status: 201 });
}
