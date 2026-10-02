"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, CheckCircle, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";

  const [checking, setChecking] = useState(true);
  const [linkError, setLinkError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) { setLinkError("This reset link is not valid."); setChecking(false); return; }
    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) setEmail(data.email || "");
        else setLinkError(data.error || "This reset link is not valid.");
      })
      .catch(() => setLinkError("Something went wrong. Please try again."))
      .finally(() => setChecking(false));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 7) { setError("Password must be at least 7 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setSaving(false); return; }
      setDone(true);
      setTimeout(() => router.push("/auth"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSaving(false);
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-mjs-red focus:ring-2 focus:ring-red-100 transition-all";

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-8">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6 text-mjs-red" />
        </div>

        {checking ? (
          <div className="text-center text-sm text-gray-500 py-6 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Checking your link…
          </div>
        ) : linkError ? (
          <div className="text-center">
            <h1 className="text-xl font-black text-mjs-dark">Link not valid</h1>
            <p className="text-sm text-gray-500 mt-2">{linkError}</p>
            <Link href="/auth?forgot=1" className="inline-block mt-6 bg-mjs-red text-white font-bold text-sm px-6 py-3 rounded-lg hover:bg-red-700 transition-colors">
              Request a new link
            </Link>
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h1 className="text-xl font-black text-mjs-dark">Password updated</h1>
            <p className="text-sm text-gray-500 mt-2">You can now log in with your new password. Taking you to the login page…</p>
            <Link href="/auth" className="inline-block mt-6 text-sm font-bold text-mjs-red hover:underline">Go to login</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="text-center mb-2">
              <h1 className="text-xl font-black text-mjs-dark">Choose a new password</h1>
              {email && <p className="text-xs text-gray-500 mt-1">for {email}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-mjs-dark mb-1.5">New password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required minLength={7} placeholder="At least 7 characters" className={`${inputClass} pr-10`} autoFocus />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-mjs-dark mb-1.5">Confirm new password</label>
              <input type={show ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Type it again" className={inputClass} />
            </div>
            {error && <div className="bg-red-50 text-red-600 text-xs font-medium px-4 py-2.5 rounded-lg">{error}</div>}
            <button type="submit" disabled={saving} className="w-full bg-mjs-red text-white font-bold py-3.5 rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 uppercase tracking-wide">
              {saving ? "Saving…" : "Save new password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
