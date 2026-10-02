import { NextResponse } from "next/server";
import { requireAuth, authErrorResponse } from "@/lib/auth";
import { parseBody } from "@/lib/api";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
});

export async function PUT(request: Request) {
  try {
    const { supabase, user } = await requireAuth();
    const parsed = await parseBody(request, profileSchema);
    
    if (parsed.response) return parsed.response;
    
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: parsed.data.full_name,
        phone: parsed.data.phone,
        address: parsed.data.address,
        city: parsed.data.city,
        province: parsed.data.province,
      }, { onConflict: "id" });
      
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return authErrorResponse(error);
  }
}
