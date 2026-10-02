"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, X, Package, CheckCircle, User, MapPin, Clock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { trackLogin, trackSignUp } from "@/lib/analytics";

export default function AuthPage() {
  const { login } = useAuth();
  const { applyCustomPrices } = useCart();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot password
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("forgot")) setShowForgot(true);
  }, []);
  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail || email }),
      });
      const data = await res.json();
      if (!res.ok) setForgotError(data.error || "Something went wrong. Please try again.");
      else setForgotSent(true);
    } catch {
      setForgotError("Something went wrong. Please try again.");
    }
    setForgotLoading(false);
  };

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [accountType, setAccountType] = useState<"business" | "individual">("business");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  const [signupError, setSignupError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [guestOrderCount, setGuestOrderCount] = useState(0);
  const [claimedOrders, setClaimedOrders] = useState(0);
  const emailCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for guest orders when email is entered during signup
  useEffect(() => {
    if (mode !== "signup" || !email || !email.includes("@")) {
      setGuestOrderCount(0);
      return;
    }
    if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current);
    emailCheckTimer.current = setTimeout(() => {
      fetch(`/api/customers/check-email?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => setGuestOrderCount(data.guestOrders || 0))
        .catch(() => setGuestOrderCount(0));
    }, 500);
    return () => { if (emailCheckTimer.current) clearTimeout(emailCheckTimer.current); };
  }, [email, mode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    if (accountType === "business" && !company.trim()) {
      setSignupError("Company name is required for business accounts.");
      return;
    }
    setSignupLoading(true);
    try {
      const res = await fetch("/api/customers/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, company, phone, password, address, city, state, zip }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSignupError(data.error || "Failed to create account. Please try again.");
        setSignupLoading(false);
        return;
      }
      login(data.customer);
      trackSignUp("email");
      setClaimedOrders(data.claimedOrders || 0);
      setShowSuccess(true);
    } catch {
      setSignupError("Something went wrong. Please try again.");
    }
    setSignupLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.customer) {
        setLoginError(data.error || "Invalid email or password.");
        setLoginLoading(false);
        return;
      }
      login(data.customer);
      if (data.customer.priceMap) {
        applyCustomPrices(data.customer.priceMap);
      }
      trackLogin("email");
      window.location.href = "/account";
    } catch {
      setLoginError("Something went wrong. Please try again.");
    }
    setLoginLoading(false);
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/";
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-mjs-red focus:ring-1 focus:ring-mjs-red/20 transition-all bg-white";

  return (
    <section className="min-h-[80vh] bg-gray-50">
      <div className="flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-[460px]">

          {/* ═══ Form ═══ */}
          <div className="px-8 sm:px-10 py-8 sm:py-10 flex flex-col">
            {/* Welcome heading */}
            <div className="mb-6 text-center">
              <div className="text-lg sm:text-xl font-black text-mjs-dark leading-tight">
                Welcome to
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-mjs-dark leading-tight">
                Mobile Janitorial Supply
              </h1>
              <p className="text-xs text-gray-500 mt-2">
                Order faster. Reorder in seconds. Access your account pricing.
              </p>
            </div>

            {/* Tab buttons */}
            <div className="flex gap-3 mb-8 justify-center">
              <button
                onClick={() => { setMode("login"); setLoginError(""); setSignupError(""); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  mode === "login"
                    ? "bg-mjs-red text-white shadow-md shadow-red-200"
                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <User className="w-4 h-4" />
                LOG IN
              </button>
              <button
                onClick={() => { setMode("signup"); setLoginError(""); setSignupError(""); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  mode === "signup"
                    ? "bg-mjs-red text-white shadow-md shadow-red-200"
                    : "bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <User className="w-4 h-4" />
                CREATE ACCOUNT
              </button>
            </div>

            {/* Form content */}
            <div className="flex-1">
              {mode === "login" && showForgot ? (
                <>
                  <div className="mb-6 text-center">
                    <h2 className="text-lg font-bold text-mjs-dark">Reset your password</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Enter your email and we&apos;ll send you a link to choose a new password.</p>
                  </div>
                  {forgotSent ? (
                    <div className="text-center">
                      <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                      <p className="text-sm font-semibold text-mjs-dark">Check your email</p>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                        If there&apos;s an account for <strong>{forgotEmail}</strong>, a reset link is on its way. It works for 1 hour. Don&apos;t see it? Check your spam folder, or call us at (714) 779-2640.
                      </p>
                      <button type="button" onClick={() => setShowForgot(false)} className="mt-6 text-sm font-bold text-mjs-red hover:underline">Back to login</button>
                    </div>
                  ) : (
                    <form onSubmit={submitForgot} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Email address</label>
                        <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required placeholder="Enter your account email" className={inputClass} autoFocus />
                      </div>
                      {forgotError && (
                        <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">{forgotError}</div>
                      )}
                      <button type="submit" disabled={forgotLoading} className="w-full bg-mjs-red text-white font-bold py-3.5 rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 uppercase tracking-wide">
                        {forgotLoading ? "Sending..." : "SEND RESET LINK"}
                      </button>
                      <p className="text-center text-sm text-gray-500">
                        <button type="button" onClick={() => setShowForgot(false)} className="text-mjs-red font-bold hover:underline">Back to login</button>
                      </p>
                    </form>
                  )}
                </>
              ) : mode === "login" ? (
                <>
                  <div className="mb-6 text-center">
                    <h2 className="text-lg font-bold text-mjs-dark">Welcome Back!</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Log in to your account to continue.</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Email Address</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email address" className={`${inputClass} pl-10`} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Password</label>
                      <div className="relative">
                        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className={`${inputClass} pl-10 pr-10`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="w-4 h-4 rounded border-gray-300 text-mjs-red focus:ring-mjs-red" />
                        <span className="text-xs text-gray-600">Remember me</span>
                      </label>
                      <button type="button" onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotSent(false); setForgotError(""); }} className="text-xs text-mjs-red font-semibold hover:underline">Forgot password?</button>
                    </div>

                    {loginError && (
                      <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">{loginError}</div>
                    )}

                    <button type="submit" disabled={loginLoading} className="w-full bg-mjs-red text-white font-bold py-3.5 rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 uppercase tracking-wide">
                      {loginLoading ? "Logging in..." : "LOG IN"}
                    </button>

                    <div className="relative my-2">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                      <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                      New to MJS?{" "}
                      <button type="button" onClick={() => setMode("signup")} className="text-mjs-red font-bold hover:underline">
                        Create an account
                      </button>
                      {" "}&rarr;
                    </p>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <h2 className="text-lg font-bold text-mjs-dark">Create Your Account</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Join MJS and start ordering at wholesale prices.</p>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-2">Account Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setAccountType("business")}
                          className={`py-2.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${accountType === "business" ? "border-mjs-red bg-red-50 text-mjs-red" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          Business
                        </button>
                        <button type="button" onClick={() => { setAccountType("individual"); setCompany(""); }}
                          className={`py-2.5 px-3 rounded-lg border-2 text-sm font-semibold transition-all ${accountType === "individual" ? "border-mjs-red bg-red-50 text-mjs-red" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                          Individual
                        </button>
                      </div>
                    </div>

                    {accountType === "business" && (
                      <div>
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Company Name</label>
                        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Acme Cleaning Services" className={inputClass} />
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Phone Number</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="(555) 123-4567" className={inputClass} />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Business Address</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Main St, Suite 100" className={inputClass} />
                    </div>

                    <div className="grid grid-cols-6 gap-3">
                      <div className="col-span-3">
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Los Angeles" className={inputClass} />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">State</label>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} required placeholder="CA" maxLength={2} className={inputClass} />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-mjs-dark mb-1.5">ZIP</label>
                        <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} required placeholder="90001" className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@company.com" className={inputClass} />
                    </div>

                    {guestOrderCount > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                        <Package className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-blue-800">We recognize your email!</div>
                          <div className="text-xs text-blue-600 mt-0.5">
                            We found <span className="font-bold">{guestOrderCount} previous order{guestOrderCount !== 1 ? "s" : ""}</span> placed with this email.
                            Complete your signup and they&apos;ll be automatically linked to your new account.
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Password</label>
                      <div className="relative">
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" className={`${inputClass} pr-10`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {signupError && (
                      <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">{signupError}</div>
                    )}

                    <button type="submit" disabled={signupLoading} className="w-full bg-mjs-red text-white font-bold py-3.5 rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 uppercase tracking-wide">
                      {signupLoading ? "Creating Account..." : "CREATE ACCOUNT"}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      By creating an account, you agree to our Terms of Service and Privacy Policy.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeSuccess}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl relative animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeSuccess} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Image src="/images/mjs-sm-logo.png" alt="MJS" width={96} height={96} className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold text-mjs-dark">Welcome to MJS!</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Your account has been created successfully. You&apos;re all set to start shopping at wholesale prices.
            </p>
            {claimedOrders > 0 && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">
                  <span className="font-bold">{claimedOrders} previous order{claimedOrders !== 1 ? "s" : ""}</span> linked to your account! View them in your dashboard.
                </p>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              {claimedOrders > 0 && (
                <a href="/account" className="flex-1 bg-mjs-dark text-white font-semibold px-4 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition-colors text-center">
                  View Orders
                </a>
              )}
              <button onClick={closeSuccess} className={`${claimedOrders > 0 ? "flex-1" : "w-full"} bg-mjs-red text-white font-semibold px-8 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors`}>
                Start Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
