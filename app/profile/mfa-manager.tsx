"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import {
  ShieldCheck,
  Trash2,
  Plus,
  Loader2,
  Copy,
  Check,
  QrCode,
} from "lucide-react";

type MfaFactor = {
  id: string;
  friendly_name?: string;
  factor_type: string;
  status: string;
  created_at: string;
};

export function MfaManager() {
  const [factors, setFactors] = useState<MfaFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const loadFactors = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (!error && data?.totp) {
        setFactors(data.totp.filter((f) => f.status === "verified"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let ignore = false;
    const fetchInitial = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (!ignore && !error && data?.totp) {
          setFactors(data.totp.filter((f) => f.status === "verified"));
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };
    fetchInitial();

    return () => {
      ignore = true;
    };
  }, [supabase]);

  const startEnrollment = async () => {
    setEnrolling(true);
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        issuer: "BookMello",
        friendlyName: "Authenticator App",
      });
      if (error) throw error;
      setFactorId(data.id);
      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start 2FA enrollment";
      addToast("error", message);
      setEnrolling(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEnrollment = async () => {
    if (factorId) {
      try {
        await supabase.auth.mfa.unenroll({ factorId });
      } catch {
        // Silently discard unverified factor
      }
    }
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerifyCode("");
    setEnrolling(false);
  };

  const completeEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factorId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode.trim(),
      });
      if (error) throw error;
      addToast("success", "Two-factor authentication enabled successfully!");
      setQrCode(null);
      setSecret(null);
      setFactorId(null);
      setVerifyCode("");
      setEnrolling(false);
      await loadFactors();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid verification code";
      addToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnenroll = async (id: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
      if (error) throw error;
      addToast("success", "Two-factor authentication removed");
      setFactors((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to unenroll 2FA";
      addToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySecret = () => {
    if (!secret) return;
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border/50 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand-gold" /> Authenticator
            App (TOTP)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Require a 6-digit code from Google Authenticator, 1Password, or
            Authy on login
          </p>
        </div>
        {factors.length === 0 && !enrolling && (
          <Button
            onClick={startEnrollment}
            disabled={isSubmitting}
            size="sm"
            className="gap-1.5 bg-brand-gold hover:bg-brand-gold-hover text-slate-900 font-semibold"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Enable 2FA
          </Button>
        )}
      </div>

      {enrolling && qrCode && (
        <form
          onSubmit={completeEnrollment}
          className="p-5 bg-muted/30 border border-border/60 rounded-2xl space-y-5 animate-in fade-in-50 duration-200"
        >
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <QrCode className="h-4 w-4 text-brand-gold" /> Scan QR Code
            </h4>
            <p className="text-xs text-muted-foreground">
              Open your authenticator app (Google Authenticator, Authy, or
              1Password) and scan the QR code below.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-white p-4 rounded-2xl border border-border shadow-xs">
              <img
                src={qrCode}
                alt="Authenticator QR Code"
                className="w-44 h-44 object-contain"
              />
            </div>

            {secret && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Can't scan? Secret:</span>
                <code className="font-mono bg-muted px-2 py-1 rounded text-foreground font-semibold">
                  {secret}
                </code>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopySecret}
                  title="Copy secret"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2 max-w-xs mx-auto">
            <label className="text-xs font-medium text-center block">
              Enter 6-digit verification code:
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              maxLength={6}
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
              className="text-center font-mono text-xl tracking-[0.3em] h-12"
              required
              autoFocus
            />
            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                disabled={isSubmitting || verifyCode.length < 6}
                className="flex-1 bg-brand-gold hover:bg-brand-gold-hover text-slate-900 font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify & Activate"
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={cancelEnrollment}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      )}

      {loading ? (
        <div className="py-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading 2FA status...
        </div>
      ) : factors.length > 0 ? (
        <div className="divide-y divide-border/40">
          {factors.map((f) => (
            <div key={f.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {f.friendly_name || "Authenticator App"}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Active &bull; Verified
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleUnenroll(f.id)}
                disabled={isSubmitting}
                className="text-destructive hover:bg-destructive/10"
                title="Remove 2FA"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        !enrolling && (
          <p className="text-sm text-muted-foreground py-1">
            Two-factor authentication is currently not enabled.
          </p>
        )
      )}
    </div>
  );
}
