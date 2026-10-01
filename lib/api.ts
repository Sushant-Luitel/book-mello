import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export async function parseBody<T>(request: Request, schema: ZodSchema<T>) {
  try { return { data: schema.parse(await request.json()) }; }
  catch (error) {
    if (error instanceof ZodError) return { response: NextResponse.json({ error: "Invalid request", details: error.flatten() }, { status: 400 }) };
    return { response: NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }
}
