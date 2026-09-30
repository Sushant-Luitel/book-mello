"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <div className="flex-1 flex flex-col justify-center items-center py-16 px-4 bg-muted/20 min-h-[70vh]">
        <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-sm border border-border/50">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold font-serif mb-2">Forgot password?</h2>
                <p className="text-muted-foreground text-sm">
                  No worries, we'll send you reset instructions.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">Email</label>
                  <Input id="email" type="email" placeholder="Enter your email" required />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Reset password"}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif mb-2">Check your email</h2>
                <p className="text-muted-foreground text-sm">
                  We sent a password reset link to your email.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSubmitted(false)}
              >
                Didn't receive the email? Click to resend
              </Button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to log in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
