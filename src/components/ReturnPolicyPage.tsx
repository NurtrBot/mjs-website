import { Mail, AlertTriangle, CreditCard, Banknote, ShieldX, Clock, RotateCcw } from "lucide-react";

const policies = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "7-Day Return Window",
    text: "Any returns made to Mobile Janitorial Supply must be made within 7 days of receipt of the order. Any returns made due to customer error are subject to a 15% restocking charge.",
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: "Returns After 7 Days",
    text: "Any returns made after 7 days are subject to a 15% restocking charge and will be decided at the discretion of Mobile Janitorial Supply.",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Credit Account Purchases",
    text: "Any returns made when purchased from a business credit account \u2014 the credit will be issued back to your account (No Exceptions). Cash credit cannot be issued if original purchase was made on a credit account.",
  },
  {
    icon: <Banknote className="w-5 h-5" />,
    title: "In-Store Cash Purchases",
    text: "If purchase has been made in store in cash, we will issue a cash credit, or you may use the credit in store.",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Credit Card Purchases",
    text: "If purchase has been made by credit card, then the credit will be issued back on the credit card used for that purchase.",
  },
  {
    icon: <ShieldX className="w-5 h-5" />,
    title: "Equipment Returns",
    text: "There will be NO RETURNS accepted on any equipment purchases that has been used. Only unopened, non-used equipment may be refunded.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <section className="bg-mjs-gray-50 min-h-screen">
      {/* Hero */}
      <div className="bg-mjs-dark">
        <div className="max-w-[1400px] mx-auto px-4 py-16 text-center">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span>/</span>
            <span className="text-gray-400">Return Policy</span>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <RotateCcw className="w-8 h-8 text-mjs-gold" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Return Policy</h1>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">
            We want you to be completely satisfied with your purchase. Please review our return guidelines below.
          </p>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="max-w-[900px] mx-auto px-4 -mt-6">
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-mjs-red">
                {policy.icon}
              </div>
              <div>
                <h3 className="font-bold text-mjs-dark text-sm mb-1">{policy.title}</h3>
                <p className="text-sm text-mjs-gray-600 leading-relaxed">{policy.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Refund Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-4">
          <h3 className="font-bold text-mjs-dark mb-3">Refund Timeline</h3>
          <p className="text-sm text-mjs-gray-600 leading-relaxed mb-4">
            You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly. This time period includes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-mjs-gray-50 rounded-lg p-4 text-center">
              <div className="text-lg font-black text-mjs-dark">5-10</div>
              <div className="text-xs text-mjs-gray-500">business days transit</div>
            </div>
            <div className="bg-mjs-gray-50 rounded-lg p-4 text-center">
              <div className="text-lg font-black text-mjs-dark">3-5</div>
              <div className="text-xs text-mjs-gray-500">business days processing</div>
            </div>
            <div className="bg-mjs-gray-50 rounded-lg p-4 text-center">
              <div className="text-lg font-black text-mjs-dark">5-10</div>
              <div className="text-xs text-mjs-gray-500">business days bank refund</div>
            </div>
          </div>
        </div>

        {/* How to Return */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mt-4">
          <h3 className="font-bold text-mjs-dark mb-2">How to Start a Return</h3>
          <p className="text-sm text-mjs-gray-600 leading-relaxed">
            If you need to return an item, please contact us with your order number and details about the product you would like to return. We will respond quickly with instructions for how to return items from your order.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-mjs-dark rounded-2xl p-8 md:p-10 text-center mt-8 mb-16">
          <h2 className="text-xl font-bold text-white mb-2">Questions or Concerns?</h2>
          <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
            If you have any questions about our return policy or need assistance with a return, feel free to reach out. We&apos;re here to help.
          </p>
          <a
            href="mailto:orders@mobilejanitorialsupply.com"
            className="inline-flex items-center gap-2 bg-mjs-red text-white font-semibold px-8 py-3 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact Us at orders@mobilejanitorialsupply.com
          </a>
        </div>
      </div>
    </section>
  );
}
