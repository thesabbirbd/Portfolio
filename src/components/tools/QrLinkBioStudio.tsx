"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  QrCode,
  CreditCard,
  Wifi,
  User,
  Download,
  Share2,
  Printer,
  Sparkles,
  Phone,
  Mail,
  Globe,
  Building,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useGatedExport } from "@/hooks/useGatedExport";
import { UniversalStudioShareBar } from "@/components/workplace/UniversalStudioShareBar";
import {
  StandeeTemplateType,
  StandeeCardData,
  VCardContact,
  generateVCardString,
  renderStandeeCardToCanvas,
} from "@/lib/barcode/vcard-standee-engine";

export function QrLinkBioStudio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [templateType, setTemplateType] = useState<StandeeTemplateType>("founder_card");

  // Contact State
  const [contact, setContact] = useState<VCardContact>({
    fullName: "Md Sabbirul Islam Khan",
    organization: "Aiyaar • THE SABBiR OS",
    title: "Chief Product Manager (CPM)",
    phone: "+8801700000000",
    whatsapp: "+8801700000000",
    bkashNumber: "01700-000000",
    email: "thesabbir.bd@gmail.com",
    website: "https://sabbir.nav.bd",
  });

  // Payment Standee State
  const [bkashMerchant, setBkashMerchant] = useState("01711-223344 (Personal)");
  const [storeName, setStoreName] = useState("গ্রামীণ এন্টারপ্রাইজ");

  // Wi-Fi State
  const [wifiSsid, setWifiSsid] = useState("SABBIR_GUEST_5G");
  const [wifiPassword, setWifiPassword] = useState("welcome2026");

  const { triggerExport, GateModal } = useGatedExport({
    toolSlug: "qr-link-bio",
    toolName: "Digital Visiting Card & vCard Standee Studio",
  });

  // Calculate QR payload
  const currentQrPayload = React.useMemo(() => {
    if (templateType === "founder_card") {
      return generateVCardString(contact);
    } else if (templateType === "bkash_payment") {
      return `bkash://payment?merchant=${encodeURIComponent(bkashMerchant)}`;
    } else {
      return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPassword};;`;
    }
  }, [templateType, contact, bkashMerchant, wifiSsid, wifiPassword]);

  // Render Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    let cardData: StandeeCardData;
    if (templateType === "founder_card") {
      cardData = {
        type: "founder_card",
        title: contact.fullName,
        subtitle: `${contact.title} • ${contact.organization}`,
        qrPayload: currentQrPayload,
        contact,
        accentColor: "#F59E0B",
      };
    } else if (templateType === "bkash_payment") {
      cardData = {
        type: "bkash_payment",
        title: storeName,
        subtitle: "সহজ পেমেন্ট ও ক্যাশ-আউট কিউআর",
        qrPayload: currentQrPayload,
        bkashMerchant,
        accentColor: "#E11D48",
      };
    } else {
      cardData = {
        type: "wifi_access",
        title: "Free High-Speed Wi-Fi",
        subtitle: "Scan to Connect Automatically",
        qrPayload: currentQrPayload,
        wifiSsid,
        wifiPassword,
        accentColor: "#38BDF8",
      };
    }

    renderStandeeCardToCanvas(canvasRef.current, cardData);
  }, [templateType, contact, bkashMerchant, storeName, wifiSsid, wifiPassword, currentQrPayload]);

  // Export Standee PNG
  const handleExportPng = () => {
    triggerExport(() => {
      if (!canvasRef.current) return;
      sound.shutter();
      const a = document.createElement("a");
      a.href = canvasRef.current.toDataURL("image/png");
      a.download = `sabbir-standee-card-${templateType}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  // Download .VCF File
  const handleDownloadVcf = () => {
    sound.shutter();
    const vcf = generateVCardString(contact);
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contact.fullName.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSharePayload = () => {
    return {
      type: "qr-standee-snapshot",
      templateType,
      contact: templateType === "founder_card" ? contact : undefined,
      bkashMerchant: templateType === "bkash_payment" ? bkashMerchant : undefined,
      wifiSsid: templateType === "wifi_access" ? wifiSsid : undefined,
      createdAt: new Date().toISOString(),
    };
  };

  return (
    <div className="w-full space-y-6">
      <UniversalStudioShareBar
        toolSlug="qr-link-bio"
        toolName="Digital Visiting Card &amp; vCard Standee Studio"
        category="Identity Studio"
        onExportClick={handleExportPng}
        getSharePayload={getSharePayload}
        previewDataUrl={canvasRef.current?.toDataURL("image/png")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Standee Preview Canvas */}
        <div className="lg:col-span-6 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col items-center justify-between min-h-[540px]">
          <div className="w-full flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
            <span className="text-xs font-mono text-neutral-400">Printable Desk Standee:</span>
            <span className="text-xs font-mono text-amber-400 font-bold">800 × 1200 High-Res</span>
          </div>

          <div className="flex-1 flex items-center justify-center p-2">
            <canvas
              ref={canvasRef}
              className="max-h-[500px] max-w-full rounded-2xl shadow-2xl border border-white/10 object-contain"
            />
          </div>

          <div className="w-full pt-3 border-t border-neutral-800 text-center text-xs text-neutral-500">
            Print on A5/A6 photo paper or acrylic desk stand.
          </div>
        </div>

        {/* Right Column: Customization Forms */}
        <div className="lg:col-span-6 rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 backdrop-blur-md space-y-5">
          {/* Template Switcher */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Select Standee Type
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "founder_card", label: "Visiting Card", icon: User },
                { id: "bkash_payment", label: "bKash Pay", icon: CreditCard },
                { id: "wifi_access", label: "Wi-Fi QR", icon: Wifi },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setTemplateType(tmpl.id as StandeeTemplateType);
                    sound.click();
                  }}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    templateType === tmpl.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-300 shadow"
                      : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                  }`}
                >
                  <tmpl.icon className="w-4 h-4 mb-1" />
                  <span>{tmpl.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* FORM 1: DIGITAL VISITING CARD */}
          {templateType === "founder_card" && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Founder &amp; Business Card Details
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="contact-name" className="block text-[11px] text-neutral-400 mb-1">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={contact.fullName}
                    onChange={(e) => setContact({ ...contact, fullName: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-org" className="block text-[11px] text-neutral-400 mb-1">Organization</label>
                  <input
                    id="contact-org"
                    type="text"
                    value={contact.organization}
                    onChange={(e) => setContact({ ...contact, organization: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="contact-title" className="block text-[11px] text-neutral-400 mb-1">Designation</label>
                  <input
                    id="contact-title"
                    type="text"
                    value={contact.title}
                    onChange={(e) => setContact({ ...contact, title: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block text-[11px] text-neutral-400 mb-1">Phone Number</label>
                  <input
                    id="contact-phone"
                    type="text"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-[11px] text-neutral-400 mb-1">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDownloadVcf}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-800 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .VCF (vCard Contact File)</span>
                </button>
              </div>
            </div>
          )}

          {/* FORM 2: BKASH PAYMENT */}
          {templateType === "bkash_payment" && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                bKash / Nagad Standee Info
              </h3>
              <div>
                <label htmlFor="store-name" className="block text-[11px] text-neutral-400 mb-1">দোকান বা ব্যবসার নাম</label>
                <input
                  id="store-name"
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label htmlFor="bkash-num" className="block text-[11px] text-neutral-400 mb-1">মার্চেন্ট / পার্সোনাল নম্বর</label>
                <input
                  id="bkash-num"
                  type="text"
                  value={bkashMerchant}
                  onChange={(e) => setBkashMerchant(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* FORM 3: WI-FI ACCESS */}
          {templateType === "wifi_access" && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Wi-Fi Network Credentials
              </h3>
              <div>
                <label htmlFor="wifi-ssid" className="block text-[11px] text-neutral-400 mb-1">Wi-Fi Network Name (SSID)</label>
                <input
                  id="wifi-ssid"
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label htmlFor="wifi-pass" className="block text-[11px] text-neutral-400 mb-1">Wi-Fi Password</label>
                <input
                  id="wifi-pass"
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Export Action */}
          <div className="pt-3 border-t border-neutral-800">
            <button
              onClick={handleExportPng}
              className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-neutral-950 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Printable Standee PNG (+25 XP)</span>
            </button>
          </div>
        </div>
      </div>

      {GateModal}
    </div>
  );
}
