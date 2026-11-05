import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { authErrorResponse } from "@/lib/auth";
import { ServiceError } from "@/lib/services/errors";

export async function parseBody<T>(request: Request, schema: ZodSchema<T>) {
  try { return { data: schema.parse(await request.json()) }; }
  catch (error) {
    if (error instanceof ZodError) return { response: NextResponse.json({ error: "Invalid request", details: error.flatten() }, { status: 400 }) };
    return { response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }
}

// Shared catch-all for route handlers: maps service/auth errors to HTTP responses.
export function handleRouteError(error: unknown) {
  if (error instanceof ServiceError) return NextResponse.json({ error: error.message }, { status: error.status });
  return authErrorResponse(error);
}
