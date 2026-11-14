"use client";

import { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Download,
  CreditCard,
  QrCode,
  Smartphone,
  Sparkles,
  Lock,
  ArrowRight,
  Receipt,
  FileText,
  Copy,
  Check,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { Resource } from "@/types";
import confetti from "canvas-confetti";

interface CheckoutModalProps {
  isOpen: boolean;
  resource: Resource | null;
  onClose: () => void;
  onSuccess?: (downloadUrl: string) => void;
}

export function CheckoutModal({ isOpen, resource, onClose, onSuccess }: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<"upi_qr" | "razorpay">("upi_qr");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Direct UPI states
  const [upiUtr, setUpiUtr] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [gatewayConfig, setGatewayConfig] = useState<{
    upiId: string;
    upiName: string;
    hasRazorpayKey: boolean;
    rawRazorpayKeyId: string;
  }>({
    upiId: "codedecoded@upi",
    upiName: "Code Decoded",
    hasRazorpayKey: false,
    rawRazorpayKeyId: "",
  });

  const [receiptDetails, setReceiptDetails] = useState<{
    orderId: string;
    paymentId: string;
    invoiceNumber: string;
    downloadUrl: string;
  } | null>(null);

  // Load gateway config from API
  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/gateway-settings")
        .then(res => res.json())
        .then(data => {
          if (data?.config) {
            setGatewayConfig(data.config);
            if (data.config.hasRazorpayKey) {
              setSelectedGateway("razorpay");
            }
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !resource) return null;

  const price = resource.price || 99;
  const originalPrice = resource.originalPrice || price * 3;
  const discountAmount = originalPrice - price;
  const discountPercent = Math.round((discountAmount / originalPrice) * 100);

  // Real UPI Payment URI
  const cleanTitle = resource.title.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 20);
  const upiUri = `upi://pay?pa=${gatewayConfig.upiId}&pn=${encodeURIComponent(
    gatewayConfig.upiName
  )}&am=${price}&cu=INR&tn=${encodeURIComponent(`CodeDecoded-${cleanTitle}`)}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiUri
  )}`;

  const copyUpiId = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(gatewayConfig.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  // Submit Handler for Razorpay Official Gateway
  const handleRazorpayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      alert("Please enter your name and email address.");
      return;
    }

    setLoading(true);

    try {
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          customerName,
          customerEmail,
          customAmount: price,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to initialize Razorpay order.");
      }

      // Check if Razorpay script is loaded in browser
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Code Decoded",
          description: resource.title,
          image: "https://codedecoded.com/images/logo.png",
          order_id: orderData.orderId,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: "#00F0FF",
          },
          handler: async function (response: any) {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              resourceId: resource.id,
              customerName,
              customerEmail,
              customerPhone,
              paymentMethod: "razorpay",
              isMock: false,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          alert(`Payment Failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
        setLoading(false);
      } else {
        alert("Razorpay Checkout SDK is still loading. Please try again in 2 seconds or use the Direct UPI QR option!");
        setLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      alert(msg);
      setLoading(false);
    }
  };

  // Submit Handler for Direct UPI QR Payment with UTR
  const handleUpiVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) {
      alert("Please provide your name and email address.");
      return;
    }

    if (!upiUtr || upiUtr.trim().length < 8) {
      alert("Please enter the 12-digit UPI Reference / UTR Number from your payment app (Google Pay / PhonePe / Paytm).");
      return;
    }

    setLoading(true);

    await verifyPayment({
      razorpay_order_id: `ORD-UPI-${Date.now().toString().slice(-8)}`,
      razorpay_payment_id: `UTR-${upiUtr.trim()}`,
      resourceId: resource.id,
      customerName,
      customerEmail,
      customerPhone,
      upiUtr: upiUtr.trim(),
      paymentMethod: "upi_direct",
      isMock: false,
    });
  };

  const verifyPayment = async (payload: any) => {
    try {
      const verifyRes = await fetch("/api/checkout/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        setIsSuccess(true);
        setReceiptDetails({
          orderId: verifyData.orderId,
          paymentId: verifyData.paymentId,
          invoiceNumber: verifyData.invoiceNumber,
          downloadUrl: verifyData.downloadUrl,
        });

        // Store purchase in localStorage
        if (typeof window !== "undefined") {
          const savedPurchases = localStorage.getItem("codedecoded_purchases");
          const purchases = savedPurchases ? JSON.parse(savedPurchases) : [];
          purchases.push({
            resourceId: resource.id,
            resourceTitle: resource.title,
            orderId: verifyData.orderId,
            paymentId: verifyData.paymentId,
            amount: price,
            date: new Date().toISOString(),
          });
          localStorage.setItem("codedecoded_purchases", JSON.stringify(purchases));

          // Also save in user orders list
          const adminOrders = localStorage.getItem("codedecoded_all_orders");
          const ordersList = adminOrders ? JSON.parse(adminOrders) : [];
          ordersList.unshift({
            id: verifyData.orderId,
            orderId: verifyData.orderId,
            paymentId: verifyData.paymentId,
            resourceId: resource.id,
            resourceTitle: resource.title,
            amount: price,
            customerName: payload.customerName,
            customerEmail: payload.customerEmail,
            customerPhone: payload.customerPhone || "N/A",
            status: "paid",
            paymentMethod: payload.paymentMethod === "upi_direct" ? "UPI (UTR Verified)" : "Razorpay Gateway",
            createdAt: new Date().toISOString(),
          });
          localStorage.setItem("codedecoded_all_orders", JSON.stringify(ordersList));
        }

        // Blast celebration confetti
        try {
          confetti({
            particleCount: 90,
            spread: 90,
            origin: { y: 0.6 },
          });
        } catch {}

        if (onSuccess) {
          onSuccess(verifyData.downloadUrl);
        }
      } else {
        alert(verifyData.error || "Payment verification failed.");
      }
    } catch {
      alert("Verification server error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPurchased = () => {
    const content = `CODE DECODED - OFFICIAL PURCHASE RECEIPT & ACCESS PASS
Order ID: ${receiptDetails?.orderId}
Payment / UTR ID: ${receiptDetails?.paymentId}
Invoice: ${receiptDetails?.invoiceNumber}
Product: ${resource.title}
Amount Paid: ₹${price} (INR)
License: Single User Lifetime Access
Customer: ${customerName} (${customerEmail})

KEY TAKEAWAYS & STUDY MATERIAL:
${resource.keyTakeaways?.map((item, idx) => `[${idx + 1}] ${item}`).join("\n\n") || "Comprehensive review guide."}

Support: support@codedecoded.com | Instagram: @code.decoded | YouTube: @codedecoded
`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resource.slug}-full-unlocked.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isSuccess ? "Payment Confirmed" : "Real Payment Gateway"}
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct Indian UPI & Razorpay 256-Bit SSL Encrypted
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {isSuccess && receiptDetails ? (
            /* SUCCESS VIEW */
            <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Payment Verified & Received
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                  Thank You, {customerName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  Your PDF is unlocked. An official invoice has been registered to{" "}
                  <strong className="text-slate-800 dark:text-slate-200">{customerEmail}</strong>.
                </p>
              </div>

              {/* Receipt Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500">Resource</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {resource.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {receiptDetails.orderId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Payment / UTR Ref</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {receiptDetails.paymentId}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ₹{price}
                  </span>
                </div>
              </div>

              {/* Download Action */}
              <button
                onClick={handleDownloadPurchased}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Your PDF Now</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
              >
                Close & Return to Resources
              </button>
            </div>
          ) : (
            /* PAYMENT SELECTION & CHECKOUT FORM */
            <div className="space-y-5">
              {/* Product Header */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      {resource.topic} • {resource.type}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {resource.fileSize || "PDF"} • Lifetime Student License
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-xs text-slate-400 line-through font-mono">
                      ₹{originalPrice}
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                      ₹{price}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Gateway Selector Tabs: Real UPI vs Real Razorpay */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Select Payment Gateway
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Tab 1: Real Direct UPI (Instant QR) */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway("upi_qr")}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      selectedGateway === "upi_qr"
                        ? "border-cyan-500 bg-cyan-500/10 text-slate-900 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-500">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">Direct UPI QR Code</p>
                      <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm (0% Fee)</p>
                    </div>
                  </button>

                  {/* Tab 2: Razorpay Gateway */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway("razorpay")}
                    className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                      selectedGateway === "razorpay"
                        ? "border-cyan-500 bg-cyan-500/10 text-slate-900 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs">Razorpay Gateway</p>
                      <p className="text-[10px] text-slate-500">Cards, NetBanking & UPI</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* GATEWAY OPTION 1: REAL DIRECT UPI QR CODE */}
              {selectedGateway === "upi_qr" && (
                <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-4">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Scan QR Code with any UPI App to Pay ₹{price}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Google Pay • PhonePe • Paytm • BHIM • Cred
                    </p>
                  </div>

                  {/* REAL QR CODE DISPLAY */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-1">
                    <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                      <img
                        src={qrCodeUrl}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                    </div>

                    <div className="space-y-3 text-xs text-left max-w-[220px]">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Recipient UPI ID:
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <code className="font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                            {gatewayConfig.upiId}
                          </code>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                          Amount:
                        </span>
                        <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">
                          ₹{price} INR
                        </span>
                      </div>

                      {/* Direct mobile intent link */}
                      <a
                        href={upiUri}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition w-full justify-center shadow-sm"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Pay on Phone (UPI)</span>
                      </a>
                    </div>
                  </div>

                  {/* FORM TO ENTER UTR AFTER PAYMENT */}
                  <form onSubmit={handleUpiVerification} className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                        Step 2: Enter details & 12-Digit UPI Reference (UTR)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Your Name *"
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={e => setCustomerEmail(e.target.value)}
                          placeholder="Your Email *"
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          required
                          maxLength={16}
                          value={upiUtr}
                          onChange={e => setUpiUtr(e.target.value)}
                          placeholder="12-digit UPI UTR / Ref No. (e.g. 431289012345) *"
                          className="w-full px-3 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-cyan-500/50 text-slate-900 dark:text-white font-mono font-bold placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          You will find this 12-digit Ref/UTR number in GPay, PhonePe, or Paytm receipt right after sending ₹{price}.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white transition flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      {loading ? (
                        <span>Verifying UPI Payment...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify Payment & Unlock PDF</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* GATEWAY OPTION 2: OFFICIAL RAZORPAY GATEWAY */}
              {selectedGateway === "razorpay" && (
                <form onSubmit={handleRazorpayPayment} className="space-y-4">
                  {!gatewayConfig.hasRazorpayKey && (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Razorpay Keys Not Configured</p>
                        <p className="text-[11px] mt-0.5">
                          You can paste your Razorpay Key ID and Secret in the{" "}
                          <a href="/admin" target="_blank" className="underline font-bold">
                            Admin &gt; Payment Gateway
                          </a>{" "}
                          tab, or use the <strong>Direct UPI QR</strong> option above right now to accept payments!
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Contact Details
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Full Name *"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="WhatsApp Mobile Number (e.g. +91 9876543210)"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Total Amount Payable:</span>
                    <span className="font-mono font-extrabold text-base text-slate-900 dark:text-white">
                      ₹{price} INR
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    {loading ? (
                      <span>Opening Razorpay Secure Window...</span>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Launch Official Razorpay (₹{price})</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" /> 100% Real Payment Gateway
                </span>
                <span>•</span>
                <span>Instant PDF Download License</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
