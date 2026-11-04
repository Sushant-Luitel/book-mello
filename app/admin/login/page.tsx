"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showMfaScreen, setShowMfaScreen] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const router = useRouter();

  const handleAdminRedirect = async (userId: string) => {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profile?.role === "ADMIN") {
      router.push("/admin");
    } else {
      await supabase.auth.signOut();
      setError("Unauthorized: This account does not have administrator privileges.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const supabase = createClient();
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    if (authData.user) {
      // Check if MFA (AAL2) is required
      const { data: aalData } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalData?.currentLevel === "aal1" && aalData?.nextLevel === "aal2") {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const totpFactor = factors?.totp?.find((f) => f.status === "verified");
        if (totpFactor) {
          setMfaFactorId(totpFactor.id);
          setShowMfaScreen(true);
          setIsLoading(false);
          return;
        }
      }

      await handleAdminRedirect(authData.user.id);
    }
    
    setIsLoading(false);
  };

  const handleVerifyMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaFactorId) return;
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: totpCode.trim(),
      });

      if (error) throw error;

      if (data?.user) {
        await handleAdminRedirect(data.user.id);
      } else {
        router.push("/admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid 2FA code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="w-full max-w-md bg-card border border-border/70 p-8 rounded-2xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            {showMfaScreen ? (
              <ShieldCheck className="w-6 h-6 text-brand-gold" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-2xl font-bold font-serif">
            {showMfaScreen ? "Two-Factor Verification" : "Admin Portal"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {showMfaScreen
              ? "Enter the 6-digit code from your authenticator app"
              : "Restricted access. Authorized personnel only."}
          </p>
        </div>

        {showMfaScreen ? (
          <form onSubmit={handleVerifyMfa} className="space-y-4 pt-2">
            {error && (
              <p className="bg-destructive/10 text-destructive p-3 text-sm rounded-md">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Authentication Code</label>
              <Input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                autoFocus
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className="text-center font-mono text-2xl tracking-[0.4em] h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-brand-gold hover:bg-brand-gold-hover text-slate-900 font-semibold"
              disabled={isLoading || totpCode.length < 6}
            >
              {isLoading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={isLoading}
              onClick={() => {
                setShowMfaScreen(false);
                setTotpCode("");
                setError("");
              }}
            >
              Back to login
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && (
              <p className="bg-destructive/10 text-destructive p-3 text-sm rounded-md">
                {error}
              </p>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="admin@bookmellow.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login to Dashboard"}
            </Button>
            
            <div className="text-center pt-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                Return to main site
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
