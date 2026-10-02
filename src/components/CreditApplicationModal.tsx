"use client";

import { useState } from "react";
import { X, Building2, Loader2, CheckCircle } from "lucide-react";
import { emptyApplication, validateApplication, type CreditApplication } from "@/lib/credit-application";

interface Props {
  customerId: number;
  defaults?: Partial<CreditApplication>;
  onClose: () => void;
  onSubmitted: () => void;
}

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-mjs-red transition-all";
const labelCls = "block text-[11px] font-semibold text-mjs-gray-500 mb-1";

function Field({ label, value, onChange, required, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className={labelCls}>{label}{required && <span className="text-mjs-red"> *</span>}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </div>
  );
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <h3 className="text-xs font-bold text-mjs-dark uppercase tracking-wider mt-6 mb-3 flex items-center gap-2">
      <span className="text-mjs-red">{num}</span> {title}
    </h3>
  );
}

export default function CreditApplicationModal({ customerId, defaults, onClose, onSubmitted }: Props) {
  const [app, setApp] = useState<CreditApplication>(() => emptyApplication(defaults));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = <K extends keyof CreditApplication>(key: K, value: CreditApplication[K]) => setApp(a => ({ ...a, [key]: value }));
  const setRef = (i: number, key: keyof CreditApplication["refs"][number], value: string) =>
    setApp(a => ({ ...a, refs: a.refs.map((r, idx) => idx === i ? { ...r, [key]: value } : r) }));

  const submit = async () => {
    const problems = validateApplication(app);
    if (problems.length > 0) { setError(problems[0]); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/customers/terms-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, application: app }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong. Please try again."); setSubmitting(false); return; }
      setDone(true);
      onSubmitted();
    } catch {
      setError("Something went wrong. Please try again or call (714) 779-2640.");
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-mjs-red" />
            </div>
            <div>
              <h2 className="text-base font-bold text-mjs-dark">Net-30 Credit Application</h2>
              <p className="text-xs text-mjs-gray-500">Business account request · reviewed within one business day</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X className="w-4 h-4 text-mjs-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-mjs-dark">Application received</h3>
            <p className="text-sm text-mjs-gray-600 mt-2 max-w-md mx-auto">
              Thanks, {app.contact.split(" ")[0] || "there"}. Our team will review your application and email you once Bill to Account is enabled. You can pay by card in the meantime.
            </p>
            <button onClick={onClose} className="mt-6 bg-mjs-dark text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-black transition-colors">Done</button>
          </div>
        ) : (
          <>
            <div className="px-6 py-2 overflow-y-auto flex-1">
              <p className="text-xs text-mjs-gray-500 mt-3">
                Complete this application to request business credit terms. Approval and limits are subject to company review. Fields marked <span className="text-mjs-red">*</span> are required.
              </p>

              <SectionTitle num="01" title="Requested account" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Legal business name" value={app.legalName} onChange={v => set("legalName", v)} required />
                <Field label="DBA, if different" value={app.dba} onChange={v => set("dba", v)} />
                <Field label="Primary contact" value={app.contact} onChange={v => set("contact", v)} required />
                <Field label="Phone" value={app.phone} onChange={v => set("phone", v)} required type="tel" />
                <Field label="Email" value={app.email} onChange={v => set("email", v)} required type="email" />
                <Field label="Business start date" value={app.startDate} onChange={v => set("startDate", v)} placeholder="e.g. 2015" />
                <Field label="Federal tax ID / EIN" value={app.ein} onChange={v => set("ein", v)} required placeholder="XX-XXXXXXX" />
                <Field label="D-U-N-S number, if available" value={app.duns} onChange={v => set("duns", v)} />
                <Field label="Credit limit requested" value={app.requestedLimit} onChange={v => set("requestedLimit", v)} placeholder="$" />
                <Field label="Initial order amount" value={app.initialOrder} onChange={v => set("initialOrder", v)} placeholder="$" />
              </div>

              <SectionTitle num="02" title="Business addresses and payables" />
              <div className="grid grid-cols-1 gap-3">
                <Field label="Registered business address" value={app.registeredAddress} onChange={v => set("registeredAddress", v)} required placeholder="Street, City, State ZIP" />
                <Field label="Billing address, if different" value={app.billingAddress} onChange={v => set("billingAddress", v)} />
                <Field label="Primary business or shipping address" value={app.shipAddress} onChange={v => set("shipAddress", v)} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Field label="Accounts payable contact" value={app.apContact} onChange={v => set("apContact", v)} required />
                  <Field label="AP email" value={app.apEmail} onChange={v => set("apEmail", v)} required type="email" />
                  <Field label="AP phone" value={app.apPhone} onChange={v => set("apPhone", v)} type="tel" />
                </div>
              </div>

              <SectionTitle num="03" title="Business and bank information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Business structure<span className="text-mjs-red"> *</span></label>
                  <select value={app.structure} onChange={e => set("structure", e.target.value)} className={inputCls}>
                    <option value="">Select…</option>
                    <option>Corporation</option>
                    <option>LLC</option>
                    <option>Partnership</option>
                    <option>Sole proprietor</option>
                    <option>Non-profit</option>
                    <option>Government / school</option>
                    <option>Other</option>
                  </select>
                </div>
                <Field label="Bank name (optional)" value={app.bankName} onChange={v => set("bankName", v)} />
                <Field label="Bank phone (optional)" value={app.bankPhone} onChange={v => set("bankPhone", v)} type="tel" />
                <Field label="Bank address (optional)" value={app.bankAddress} onChange={v => set("bankAddress", v)} />
              </div>

              <SectionTitle num="04" title="Trade references" />
              <p className="text-xs text-mjs-gray-500 -mt-2 mb-3">Suppliers you currently buy from on terms. At least two are required.</p>
              {app.refs.map((r, i) => (
                <div key={i} className="bg-mjs-gray-50 rounded-xl p-3 mb-3">
                  <div className="text-[11px] font-bold text-mjs-gray-600 mb-2">Reference {i + 1}{i < 2 && <span className="text-mjs-red"> *</span>}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Company" value={r.name} onChange={v => setRef(i, "name", v)} />
                    <Field label="Contact name" value={r.contact} onChange={v => setRef(i, "contact", v)} />
                    <Field label="Phone" value={r.phone} onChange={v => setRef(i, "phone", v)} type="tel" />
                    <Field label="Email" value={r.email} onChange={v => setRef(i, "email", v)} type="email" />
                    <Field label="Account number, if known" value={r.account} onChange={v => setRef(i, "account", v)} />
                  </div>
                </div>
              ))}

              <SectionTitle num="05" title="Authorization" />
              <p className="text-xs text-mjs-gray-500 leading-relaxed mb-3">
                By submitting, I certify that I am authorized to submit this application on behalf of the business and that the information provided is accurate to the best of my knowledge. I authorize Mobile Janitorial Supply to contact the bank and trade references listed above and to make reasonable inquiries to evaluate this business credit request. This application does not guarantee credit approval or establish payment terms; approved terms will be communicated separately.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Authorized signer name" value={app.signer} onChange={v => set("signer", v)} required placeholder="Type your full name" />
                <Field label="Title" value={app.signerTitle} onChange={v => set("signerTitle", v)} required placeholder="Owner, Manager…" />
              </div>
              <label className="flex items-start gap-2 mt-3 mb-4 cursor-pointer">
                <input type="checkbox" checked={app.certified} onChange={e => set("certified", e.target.checked)} className="mt-0.5 accent-mjs-red" />
                <span className="text-xs text-mjs-gray-700">I certify the above and agree that typing my name serves as my signature.<span className="text-mjs-red"> *</span></span>
              </label>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <a href="/forms/credit-application.pdf" target="_blank" rel="noopener" className="text-xs font-semibold text-mjs-gray-500 hover:text-mjs-red">
                Prefer paper? Download the PDF
              </a>
              <div className="flex items-center gap-3">
                {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-mjs-red text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Sending…" : "Send Application"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
