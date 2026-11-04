"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { KeyRound, Trash2, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

type PasskeyItem = {
  id: string;
  friendly_name?: string;
  created_at: string;
  last_used_at?: string;
};

export function PasskeyManager() {
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { addToast } = useToast();
  const supabase = useMemo(() => createClient(), []);

  const loadPasskeys = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.passkey.list();
      if (!error && data) {
        setPasskeys(data);
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
        const { data, error } = await supabase.auth.passkey.list();
        if (!ignore && !error && data) {
          setPasskeys(data);
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

  const handleRegisterPasskey = async () => {
    setRegistering(true);
    try {
      const { error } = await supabase.auth.registerPasskey();
      if (error) {
        addToast("error", error.message);
        return;
      }
      addToast("success", "Passkey added successfully!");
      await loadPasskeys();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to register passkey";
      addToast("error", message);
    } finally {
      setRegistering(false);
    }
  };

  const handleDeletePasskey = async (passkeyId: string) => {
    try {
      const { error } = await supabase.auth.passkey.delete({ passkeyId });
      if (error) {
        addToast("error", error.message);
        return;
      }
      addToast("success", "Passkey deleted");
      setPasskeys((prev) => prev.filter((p) => p.id !== passkeyId));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete passkey";
      addToast("error", message);
    }
  };

  return (
    <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border/50 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-serif font-bold flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-brand-gold" /> Passkeys
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sign in securely using biometric recognition (Touch ID, Face ID,
            Windows Hello)
          </p>
        </div>
        <Button
          onClick={handleRegisterPasskey}
          disabled={registering}
          size="sm"
          className="gap-1.5 bg-brand-gold hover:bg-brand-gold-hover text-slate-900 font-semibold"
        >
          {registering ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Passkey
        </Button>
      </div>

      {loading ? (
        <div className="py-4 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading passkeys...
        </div>
      ) : passkeys.length === 0 ? (
        <p className="text-sm text-muted-foreground py-2">
          No passkeys registered on this device yet.
        </p>
      ) : (
        <div className="divide-y divide-border/40">
          {passkeys.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  {p.friendly_name || "Device Authenticator"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Added on {new Date(p.created_at).toLocaleDateString()}
                  {p.last_used_at &&
                    ` • Last used ${new Date(p.last_used_at).toLocaleDateString()}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeletePasskey(p.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
