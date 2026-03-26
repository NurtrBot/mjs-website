"use client";

import { useState } from "react";
import { Eye, EyeOff, X, FileDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login({ firstName, lastName, email, company });
    setShowSuccess(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ firstName: email.split("@")[0], lastName: "", email, company: "" });
    window.location.href = "/";
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    window.location.href = "/";
  };

  const inputClass =
    "w-full border-b border-gray-200 px-1 py-2.5 text-sm outline-none focus:border-mjs-red transition-all bg-transparent";

  const forms = [
    { name: "Credit Application", file: "/forms/credit-application.pdf" },
    { name: "Credit Card Authorization", file: "/forms/credit-card-authorization-form.pdf" },
    { name: "Customer Order Form", file: "/forms/customer-order-form.pdf" },
    { name: "New Customer Contact Form", file: "/forms/new-customer-contact-form.pdf" },
    { name: "Resale Certificate (CA)", file: "/forms/Resale-certificate-california.pdf" },
  ];

  return (
    <section className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Outer card container */}
      <div className="w-full max-w-[1050px] bg-white rounded-3xl shadow-lg overflow-hidden flex scale-[0.85] origin-center">

        {/* Left - Form side */}
        <div className="w-full lg:w-1/2 flex flex-col px-10 py-8">
          {/* Logo */}
          <a href="/" className="mb-8">
            <img src="/images/mjs-logo.png" alt="MJS" className="h-8" />
          </a>

          {/* Content area - fixed height, vertically centered */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Header badge + heading */}
            {mode === "signup" && (
              <span className="inline-block bg-red-50 text-mjs-red text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                New Customer Account
              </span>
            )}
            <h1 className="text-2xl font-bold text-mjs-dark">
              {mode === "signup" ? "Get Started" : "Welcome Back"}
            </h1>
            <p className="text-sm text-mjs-gray-400 mt-1 mb-8">
              {mode === "signup"
                ? "Welcome to MJS \u2013 Let\u2019s create your business account"
                : "Welcome to MJS \u2013 Log in to your account"}
            </p>

            <hr className="border-gray-100 mb-6" />
            <div>
              {mode === "signup" ? (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-mjs-gray-600 mb-1">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="John" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Company Name</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required placeholder="Acme Cleaning Services" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Phone Number</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="(555) 123-4567" className={inputClass} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Business Address</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required placeholder="123 Main St, Suite 100" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-6 gap-3">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-mjs-gray-600 mb-1">City</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Los Angeles" className={inputClass} />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-mjs-gray-600 mb-1">State</label>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} required placeholder="CA" maxLength={2} className={inputClass} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-mjs-gray-600 mb-1">ZIP</label>
                      <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} required placeholder="90001" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@company.com" className={inputClass} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-mjs-gray-600">Password</label>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" className={`${inputClass} pr-10`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2 text-mjs-gray-400 hover:text-mjs-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-mjs-red text-white font-semibold py-3 rounded-full text-sm hover:bg-red-700 transition-colors">
                    Create Account
                  </button>

                  <p className="text-center text-xs text-mjs-gray-400">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setMode("login")} className="text-mjs-dark font-bold hover:underline">
                      Log in
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium text-mjs-gray-600 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="john@company.com" className={inputClass} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-mjs-gray-600">Password</label>
                      <a href="#" className="text-xs text-mjs-red font-medium hover:underline">Forgot?</a>
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" className={`${inputClass} pr-10`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2 text-mjs-gray-400 hover:text-mjs-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-mjs-red text-white font-semibold py-3 rounded-full text-sm hover:bg-red-700 transition-colors">
                    Log In
                  </button>

                  <p className="text-center text-xs text-mjs-gray-400">
                    New to MJS?{" "}
                    <button type="button" onClick={() => setMode("signup")} className="text-mjs-dark font-bold hover:underline">
                      Create an account
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-[10px] text-mjs-gray-400 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Right - Image side */}
        <div className="hidden lg:block lg:w-1/2 relative rounded-3xl overflow-hidden m-3">
          <img
            src="/images/auth-hero.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={closeSuccess}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl relative animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeSuccess} className="absolute top-4 right-4 text-mjs-gray-400 hover:text-mjs-gray-600">
              <X className="w-5 h-5" />
            </button>
            <div className="w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <img src="/images/mjs-sm-logo.png" alt="MJS" className="w-full h-full object-contain" />
            </div>
            <h3 className="text-xl font-bold text-mjs-dark">Welcome to MJS!</h3>
            <p className="text-sm text-mjs-gray-500 mt-2 leading-relaxed">
              Your account has been created successfully. You&apos;re all set to start shopping at wholesale prices.
            </p>
            <button onClick={closeSuccess} className="mt-6 bg-mjs-red text-white font-semibold px-8 py-2.5 rounded-lg text-sm hover:bg-red-700 transition-colors">
              Start Shopping
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
