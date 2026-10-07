import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request:Request) {
    const requestUrl=new URL(request.url);    
    const code=requestUrl.searchParams.get('code');
    const next=requestUrl.searchParams.get('next')??'/';

    if(code){
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        
        if(!error && data?.user){
            // Check if user has a complete profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name')
                .eq('id', data.user.id)
                .single();
                
            if (!profile || !profile.full_name) {
                return NextResponse.redirect(new URL('/onboarding', requestUrl.origin));
            }
            
            return NextResponse.redirect(new URL(next,requestUrl.origin))
        }
    }
return NextResponse.redirect(new URL('login?error=OAuthCallbackError',request.url))
}