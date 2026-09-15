import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Zap, Github, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export default function LoginPage() {
  const { signInWithGoogle, signInWithGithub, auth } = useAuth();
  
  const [phoneMode, setPhoneMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    if (phoneMode && !recaptchaVerifierRef.current && recaptchaContainerRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: "normal",
      });
      recaptchaVerifierRef.current.render().catch(console.error);
    }
  }, [phoneMode, auth]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (!recaptchaVerifierRef.current) throw new Error("Recaptcha not initialized");
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      setError(err.message || "Failed to send SMS.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      // Successful login will be handled by AuthContext onAuthStateChanged
    } catch (err: any) {
      setError(err.message || "Invalid verification code.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center max-w-sm w-full text-center px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-primary text-primary-foreground shadow-sm">
          <Zap size={24} strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 font-display text-[32px] leading-tight text-foreground">
          Welcome to Momentum
        </h1>
        <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
          Your personal space to track your job search, prepare for interviews, and keep your momentum going.
        </p>

        {error && (
          <div className="mt-4 p-3 w-full rounded bg-destructive/10 text-destructive text-sm text-left">
            {error}
          </div>
        )}

        {!phoneMode ? (
          <div className="mt-8 flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={signInWithGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-[14px] font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={signInWithGithub}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-[#24292e] text-white px-5 py-4 text-[14px] font-semibold transition-colors hover:bg-[#2c3137]"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>

            <div className="relative my-2 w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPhoneMode(true);
                setError("");
              }}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-5 py-4 text-[14px] font-semibold text-foreground transition-colors hover:bg-muted"
            >
              <Phone className="h-5 w-5" />
              Continue with Phone Number
            </button>
          </div>
        ) : (
          <div className="mt-8 flex w-full flex-col gap-4 text-left">
            <button
              onClick={() => {
                setPhoneMode(false);
                setConfirmationResult(null);
                setError("");
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Back to options
            </button>

            {!confirmationResult ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Include your country code (e.g. +1).</p>
                </div>
                
                {/* Firebase Recaptcha Container */}
                <div ref={recaptchaContainerRef} className="w-full flex justify-center overflow-hidden"></div>

                <button
                  type="submit"
                  disabled={loading || !phoneNumber}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="otp" className="text-sm font-medium">Verification Code</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Enter the 6-digit code sent to {phoneNumber}.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[14px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
