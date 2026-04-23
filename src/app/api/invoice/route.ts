import { NextRequest, NextResponse } from "next/server";

// Returns HTML invoice that the browser renders as a printable page
// The client opens this in a new tab and the browser's PDF save works natively
export async function POST(req: NextRequest) {
  try {
    const { order, customer } = await req.json();

    const lineItems = (order.lineItems || []) as { name: string; sku: string; qty: number; price: number; lineTotal?: number }[];
    const subtotal = lineItems.reduce((s: number, i) => s + (i.lineTotal || i.price * i.qty), 0);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Invoice ${order.id} — Mobile Janitorial Supply</title>
<style>
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @page { margin: 0.4in; size: letter; }
    .no-print { display: none !important; }
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #1a1a2e; font-size: 12px; background: white; }
  .page { max-width: 800px; margin: 0 auto; padding: 30px; }
  .top-bar { height: 6px; background: #dc2626; margin-bottom: 20px; border-radius: 3px; }

  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #dc2626; }
  .header-left { display: flex; align-items: center; gap: 14px; }
  .header-left img { width: 80px; height: auto; }
  .company-info h1 { font-size: 16px; font-weight: 900; letter-spacing: -0.3px; }
  .company-info p { font-size: 9px; color: #6b7280; line-height: 1.5; }
  .invoice-badge { background: #dc2626; color: white; padding: 10px 20px; border-radius: 8px; text-align: center; }
  .invoice-badge .label { font-size: 8px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
  .invoice-badge .number { font-size: 18px; font-weight: 900; margin-top: 2px; }

  .addresses { display: flex; gap: 15px; margin-bottom: 18px; }
  .addr-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; }
  .addr-label { background: #dc2626; color: white; font-size: 7px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; display: inline-block; margin-bottom: 6px; }
  .addr-box strong { font-size: 11px; }
  .addr-box .detail { font-size: 9px; color: #6b7280; margin-top: 2px; }

  .meta { display: flex; gap: 10px; margin-bottom: 18px; }
  .meta-item { flex: 1; text-align: center; }
  .meta-label { background: #1a1a2e; color: white; font-size: 7px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 3px; display: inline-block; margin-bottom: 4px; }
  .meta-value { font-size: 11px; font-weight: 700; }
  .status-badge { font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 10px; display: inline-block; }

  table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
  thead th { background: #1a1a2e; color: white; font-size: 8px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 7px 10px; text-align: left; }
  thead th.right { text-align: right; }
  thead th.center { text-align: center; }
  tbody td { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; font-size: 10px; }
  tbody td.right { text-align: right; }
  tbody td.center { text-align: center; }
  tbody td.bold { font-weight: 700; }

  .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
  .totals-table { width: 240px; }
  .totals-row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 11px; }
  .totals-row .label { color: #6b7280; }
  .totals-row .value { font-weight: 600; }
  .totals-row.grand { border-top: 2px solid #1a1a2e; padding-top: 8px; margin-top: 5px; }
  .total-badge { background: #dc2626; color: white; font-size: 9px; font-weight: 800; padding: 3px 10px; border-radius: 4px; }
  .total-amount { font-size: 20px; font-weight: 900; color: #dc2626; }
  .free { color: #059669; font-weight: 700; }

  .terms-label { background: #dc2626; color: white; font-size: 7px; font-weight: 800; letter-spacing: 1px; padding: 3px 10px; border-radius: 3px; display: inline-block; margin-bottom: 6px; }
  .terms-value { font-size: 11px; font-weight: 600; }

  .footer { margin-top: 25px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 7px; color: #9ca3af; line-height: 1.6; }
  .bottom-bar { height: 6px; background: #dc2626; margin-top: 20px; border-radius: 3px; }

  .print-btn { position: fixed; bottom: 20px; right: 20px; background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(220,38,38,0.3); z-index: 100; }
  .print-btn:hover { background: #b91c1c; }
</style>
</head>
<body>
<div class="page">
  <div class="top-bar"></div>

  <div class="header">
    <div class="header-left">
      <img src="/images/mjs-logo.png" alt="MJS" />
      <div class="company-info">
        <h1>MOBILE JANITORIAL SUPPLY</h1>
        <p>3066 E. La Palma Ave, Anaheim, CA 92806</p>
        <p>(714) 779-2640 · Fax: (714) 779-7789</p>
        <p>orders@mobilejanitorialsupply.com</p>
        <p><strong>Hours: 6:30 AM - 3:00 PM</strong></p>
      </div>
    </div>
    <div class="invoice-badge">
      <div class="label">Invoice</div>
      <div class="number">${order.id}</div>
    </div>
  </div>

  <div class="addresses">
    <div class="addr-box">
      <span class="addr-label">Sold To / Bill To</span>
      <div><strong>${customer.company || `${customer.firstName} ${customer.lastName}`}</strong></div>
      <div class="detail">${customer.firstName} ${customer.lastName}</div>
      <div class="detail">${customer.email || ""}</div>
      ${customer.phone ? `<div class="detail">${customer.phone}</div>` : ""}
    </div>
    <div class="addr-box">
      <span class="addr-label">Ship To</span>
      <div><strong>${customer.company || `${customer.firstName} ${customer.lastName}`}</strong></div>
      <div class="detail">${customer.firstName} ${customer.lastName}</div>
      <div class="detail">${customer.email || ""}</div>
      ${customer.phone ? `<div class="detail">${customer.phone}</div>` : ""}
    </div>
  </div>

  <div class="meta">
    <div class="meta-item">
      <span class="meta-label">Date</span><br>
      <span class="meta-value">${order.date}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Status</span><br>
      <span class="status-badge" style="background:#f3f4f6;color:#374151;">${order.status}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Items</span><br>
      <span class="meta-value">${order.items}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Phone</span><br>
      <span class="meta-value">${customer.phone || "(714) 779-2640"}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:45%">Item / Description</th>
        <th>SKU</th>
        <th class="center">Qty</th>
        <th class="right">Price</th>
        <th class="right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${lineItems.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.sku}</td>
        <td class="center">${item.qty}</td>
        <td class="right">$${item.price.toFixed(2)}</td>
        <td class="right bold">$${(item.lineTotal || item.price * item.qty).toFixed(2)}</td>
      </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-table">
      <div class="totals-row"><span class="label">Subtotal</span><span class="value">$${subtotal.toFixed(2)}</span></div>
      <div class="totals-row"><span class="label">Tax</span><span class="value">$${(order.tax || 0).toFixed(2)}</span></div>
      <div class="totals-row"><span class="label">Shipping</span><span class="value ${order.shipping === 0 ? "free" : ""}">${order.shipping === 0 ? "FREE" : "$" + order.shipping.toFixed(2)}</span></div>
      <div class="totals-row grand">
        <span><span class="total-badge">Total</span></span>
        <span class="total-amount">$${(order.total || 0).toFixed(2)}</span>
      </div>
    </div>
  </div>

  <div>
    <span class="terms-label">Payment Terms</span>
    <div class="terms-value">Due on receipt</div>
  </div>

  <div class="footer">
    <strong>Legal Disclaimer:</strong> By accepting this invoice, the customer agrees that all items have been received in new and proper condition. The customer is responsible for paying this invoice according to the terms stated herein. If the account is not kept current, it may be placed on credit hold pending payment. If the payment is late beyond the agreed credit terms, Mobile Janitorial Supply reserves the right to charge 1.5% interest monthly on the total invoice amount unless other arrangements have been made. Any legal costs arising from the collection of past due invoices will be paid by the buyer. Any returns may be subject to a 15% restocking charge. NO EQUIPMENT can be returned for refund or credit. All equipment sales are final. Warranty repairs must be handled directly with the manufacturer or an authorized repair center with assistance from Mobile Janitorial Supply. Returned checks or any form of returned bad debt will be subject to a $25.00 service fee.
  </div>

  <div class="bottom-bar"></div>
</div>

<button class="print-btn no-print" onclick="window.print()">Save as PDF</button>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
