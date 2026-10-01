import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AuthError("Authentication required", 401);
  return { supabase, user };
}

export async function requireAdmin() {
  const context = await requireAuth();
  const { data: profile, error } = await context.supabase
    .from("profiles").select("role,status").eq("id", context.user.id).single();
  if (error || profile?.status !== "ACTIVE" || profile.role !== "ADMIN") {
    throw new AuthError("Administrator access required", 403);
  }
  return { ...context, profile };
}

export class AuthError extends Error {
  constructor(message: string, public status: 401 | 403) { super(message); }
}

export function authErrorResponse(error: unknown) {
  if (error instanceof AuthError) return NextResponse.json({ error: error.message }, { status: error.status });
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
