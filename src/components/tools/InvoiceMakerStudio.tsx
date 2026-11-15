"use client";

import React, { useState, useRef } from "react";
import {
  Receipt,
  Download,
  Printer,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  QrCode,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { osStore } from "@/lib/os-store";
import { generateQrMatrix, encodeCode128B } from "@/lib/barcode/scannable-codes";

interface InvoiceItem {
  id: string;
  name: string;
  qty: number;
  rate: number;
}

export function InvoiceMakerStudio() {
  const [shopName, setShopName] = useState<string>("THE SABBiR TECH & APPAREL");
  const [customerName, setCustomerName] = useState<string>("Farhana Yeasmin");
  const [customerPhone, setCustomerPhone] = useState<string>("01711223344");
  const [customerCity, setCustomerCity] = useState<string>("Uttara, Dhaka");
  const [invoiceMode, setInvoiceMode] = useState<"a4" | "thermal">("a4");
  const [vatPct, setVatPct] = useState<number>(5);
  const [courierFee, setCourierFee] = useState<number>(70);
  const [discount, setDiscount] = useState<number>(100);
  const [bkashNumber, setBkashNumber] = useState<string>("01700000000");

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", name: "Premium Cotton Panjabi", qty: 2, rate: 1850 },
    { id: "2", name: "Genuine Leather Belt", qty: 1, rate: 650 },
  ]);

  const handleAddItem = () => {
    sound.type();
    setItems([
      ...items,
      { id: String(Date.now()), name: "New Product", qty: 1, rate: 500 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    sound.toggleSwitch();
    setItems(items.filter((i) => i.id !== id));
  };

  const subtotal = items.reduce((acc, i) => acc + i.qty * i.rate, 0);
  const vatAmount = Math.round((subtotal * vatPct) / 100);
  const grandTotal = subtotal + vatAmount + courierFee - discount;

  const handlePrint = () => {
    sound.shutter();
    osStore.addXp(30, "Generated SME Invoice");
    osStore.incrementToolRun();
    window.print();
  };

  return (
    <div className="w-full bg-surface border border-line rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <Receipt className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-mono text-ink tracking-tight">
              BD Business Invoice, Cash Memo &amp; POS Maker
            </h2>
          </div>
          <p className="text-xs text-ink-3 mt-1">
            bKash/Nagad Payment • Courier Shipping • A4 Corporate &amp; 80mm Thermal Print
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-line text-xs font-mono">
            <button
              onClick={() => {
                sound.toggleSwitch();
                setInvoiceMode("a4");
              }}
              className={`px-3 py-1 rounded-lg transition ${
                invoiceMode === "a4" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              A4 Corporate
            </button>
            <button
              onClick={() => {
                sound.toggleSwitch();
                setInvoiceMode("thermal");
              }}
              className={`px-3 py-1 rounded-lg transition ${
                invoiceMode === "thermal" ? "bg-primary text-white font-bold" : "text-ink-3 hover:text-ink"
              }`}
            >
              80mm Thermal
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:block">
        {/* Editor Form (Hidden on Print) */}
        <div className="lg:col-span-5 space-y-4 p-5 rounded-2xl bg-muted/20 border border-line text-xs font-mono print:hidden">
          <span className="font-bold text-ink uppercase tracking-wider block">Customer &amp; Shop Meta</span>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-ink-3 block">Shop Name</span>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-ink-3 block">Customer Name</span>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
                />
              </div>
              <div>
                <span className="text-[10px] text-ink-3 block">Customer Phone</span>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-ink-3 block">bKash/Nagad Merchant Number</span>
              <input
                type="text"
                value={bkashNumber}
                onChange={(e) => setBkashNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-surface border border-line text-ink"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-line">
            <span className="font-bold text-ink uppercase tracking-wider block">Adjustments</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-ink-3 block">VAT %</span>
                <input
                  type="number"
                  value={vatPct}
                  onChange={(e) => setVatPct(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-xl bg-surface border border-line text-ink"
                />
              </div>
              <div>
                <span className="text-[10px] text-ink-3 block">Delivery (৳)</span>
                <input
                  type="number"
                  value={courierFee}
                  onChange={(e) => setCourierFee(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-xl bg-surface border border-line text-ink"
                />
              </div>
              <div>
                <span className="text-[10px] text-ink-3 block">Discount (৳)</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-2 py-1 rounded-xl bg-surface border border-line text-ink"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Document Preview */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            className={`bg-white text-zinc-900 border border-zinc-200 shadow-xl rounded-2xl p-6 sm:p-8 space-y-6 ${
              invoiceMode === "thermal" ? "max-w-[340px] font-mono text-[11px]" : "w-full font-sans text-xs"
            }`}
          >
            {/* Header */}
            <div className="border-b border-zinc-200 pb-4 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-zinc-950 uppercase tracking-tight">{shopName}</h3>
                <p className="text-zinc-500 text-[11px]">Official Tax &amp; Sales Invoice</p>
                <p className="text-zinc-500 text-[10px]">Date: {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-1 rounded bg-zinc-100 font-mono text-[10px] font-bold text-zinc-800">
                  INV-{Date.now().toString().slice(-6)}
                </span>
              </div>
            </div>

            {/* Bill To */}
            <div className="space-y-0.5 text-zinc-600">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">Billed To:</span>
              <p className="font-bold text-zinc-900">{customerName}</p>
              <p>{customerPhone}</p>
              <p>{customerCity}</p>
            </div>

            {/* Item Table */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-300 text-zinc-400 text-[10px] uppercase">
                  <th className="py-1">Item</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Price</th>
                  <th className="py-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 font-medium">{item.name}</td>
                    <td className="py-2 text-center text-zinc-500">{item.qty}</td>
                    <td className="py-2 text-right">৳{item.rate}</td>
                    <td className="py-2 text-right font-bold">৳{item.qty * item.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculation Breakdown */}
            <div className="border-t border-zinc-200 pt-3 space-y-1 text-right">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal:</span>
                <span>৳ {subtotal.toLocaleString()}</span>
              </div>
              {vatAmount > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>VAT ({vatPct}%):</span>
                  <span>৳ {vatAmount.toLocaleString()}</span>
                </div>
              )}
              {courierFee > 0 && (
                <div className="flex justify-between text-zinc-500">
                  <span>Delivery Charge:</span>
                  <span>৳ {courierFee.toLocaleString()}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount:</span>
                  <span>- ৳ {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-zinc-950 pt-2 border-t border-zinc-300">
                <span>Grand Total:</span>
                <span className="text-rose-600">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* bKash Payment Footer with True Scannable QR */}
            <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-between gap-3 text-pink-900">
              <div>
                <span className="text-[10px] font-bold uppercase block">bKash / Nagad Send Money:</span>
                <span className="font-mono font-bold text-xs">{bkashNumber}</span>
                <span className="text-[9px] text-pink-700 block mt-0.5">Scan with bKash app to verify</span>
              </div>
              {(() => {
                const qr = generateQrMatrix(`tel:${bkashNumber}`);
                return (
                  <div className="p-1 bg-white border border-pink-200 rounded-lg shrink-0">
                    <svg viewBox={`0 0 ${qr.size + 8} ${qr.size + 8}`} className="w-12 h-12">
                      <rect width="100%" height="100%" fill="#ffffff" />
                      {qr.matrix.map((row, r) =>
                        row.map(
                          (isDark, c) =>
                            isDark && (
                              <rect key={`${r}-${c}`} x={c + 4} y={r + 4} width={1} height={1} fill="#e11d48" />
                            )
                        )
                      )}
                    </svg>
                  </div>
                );
              })()}
            </div>

            <div className="text-center text-zinc-400 text-[10px] border-t border-zinc-200 pt-3">
              Thank you for your business! Powered by THE SABBiR OS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
