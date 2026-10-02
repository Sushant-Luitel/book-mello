"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, BookOpen, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: name,
        email: email,
      }, { onConflict: "id" });
      
      // Ensure they are fully signed out so they have to login
      await supabase.auth.signOut();
    }

    // Success! Redirect to login
    router.push("/login");
  };

  // Simple password strength calculation
  const strength = Math.min(100, (password.length / 12) * 100);
  const getStrengthColor = () => {
    if (strength < 30) return "bg-destructive";
    if (strength < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Image/Branding */}
      <div className="hidden md:flex flex-col md:w-1/2 lg:w-3/5 bg-primary p-12 text-primary-foreground relative overflow-hidden justify-center items-center">
        <div className="absolute inset-0 z-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auth-pattern2" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="currentColor"/>
                <path d="M30 0L30 60M0 30L60 30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-pattern2)"/>
          </svg>
        </div>
        
        <div className="relative z-10 max-w-lg text-center space-y-8">
          <Link href="/" className="inline-flex items-center gap-2 group bg-primary-foreground/10 px-4 py-2 rounded-full hover:bg-primary-foreground/20 transition-colors">
            <BookOpen className="h-5 w-5" />
            <span className="font-serif font-bold tracking-tight">Book Mellow</span>
          </Link>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight">Start your reading journey.</h1>
          
          <ul className="text-left space-y-4 max-w-sm mx-auto mt-8">
            <li className="flex items-center gap-3 bg-primary-foreground/5 p-3 rounded-lg border border-primary-foreground/10">
              <Check className="h-5 w-5 text-accent shrink-0" />
              <span>Track books you've read and want to read</span>
            </li>
            <li className="flex items-center gap-3 bg-primary-foreground/5 p-3 rounded-lg border border-primary-foreground/10">
              <Check className="h-5 w-5 text-accent shrink-0" />
              <span>Get personalized recommendations</span>
            </li>
            <li className="flex items-center gap-3 bg-primary-foreground/5 p-3 rounded-lg border border-primary-foreground/10">
              <Check className="h-5 w-5 text-accent shrink-0" />
              <span>Write reviews and join discussions</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-16 relative overflow-y-auto">
        <Link href="/" className="md:hidden absolute top-6 left-6 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold text-xl text-primary">Book Mellow</span>
        </Link>
        
        <div className="w-full max-w-md space-y-8 py-8 md:py-0">
          <div className="text-center md:text-left mt-10 md:mt-0">
            <h2 className="text-3xl font-bold font-serif mb-2">Create an account</h2>
            <p className="text-muted-foreground text-sm">Join thousands of readers today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <p className="bg-destructive/10 text-destructive p-3 text-sm rounded-md">{error}</p>}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Full Name</label>
              <Input id="name" placeholder="Jane Doe" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Create a strong password" 
                  required 
                  className="pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${strength}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {strength < 30 ? "Weak" : strength < 70 ? "Good" : "Strong"}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" className="mt-1" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <Button type="submit" className="w-full text-base py-6" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-card hover:bg-muted" type="button">
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground pb-8 md:pb-0">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
