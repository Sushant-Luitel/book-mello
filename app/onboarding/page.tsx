"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
      }, { onConflict: "id" });

    if (upsertError) {
      console.error(upsertError);
      setError("Failed to create profile. Please try again.");
      setIsLoading(false);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-3xl shadow-sm border border-border/50">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-serif mb-2">Welcome!</h2>
          <p className="text-muted-foreground text-sm">Let's finish setting up your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="fullName">Full Name</label>
            <Input 
              id="fullName" 
              placeholder="e.g. Jane Austen" 
              required 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
            />
          </div>

          <Button type="submit" className="w-full py-6 text-base" disabled={isLoading || !fullName.trim()}>
            {isLoading ? "Saving..." : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  );
}

