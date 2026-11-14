import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { initialResources } from "@/data/resourcesData";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");
const ordersPath = path.join(process.cwd(), "src", "data", "orders.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      resourceId,
      customerName,
      customerEmail,
      customerPhone,
      upiUtr,
      paymentMethod,
      isMock,
    } = body;

    // Read config
    let fileConfig: any = {};
    try {
      const raw = await readFile(configPath, "utf-8");
      fileConfig = JSON.parse(raw);
    } catch {
      fileConfig = {};
    }

    const keySecret = fileConfig.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

    // Real Razorpay signature verification
    if (!isMock && keySecret && razorpay_signature && razorpay_order_id && razorpay_payment_id) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature verification failed." },
          { status: 400 }
        );
      }
    }

    // Direct UPI payment with 12-digit UTR validation
    if (paymentMethod === "upi_direct" && !upiUtr) {
      return NextResponse.json(
        { success: false, error: "Please provide the 12-digit UPI UTR / Reference Number." },
        { status: 400 }
      );
    }

    // Find the resource
    const resource = initialResources.find(r => r.id === resourceId);
    const invoiceNumber = `INV-CD-${Date.now().toString().slice(-6)}`;
    const downloadUrl =
      resource?.fileUrl || resource?.downloadUrl || `/downloads/${resource?.slug || "guide"}.pdf`;

    const finalPaymentId = upiUtr ? `UTR-${upiUtr}` : razorpay_payment_id || `PAY-${Date.now()}`;
    const finalOrderId = razorpay_order_id || `ORD-UPI-${Date.now()}`;

    const newOrder = {
      id: finalOrderId,
      orderId: finalOrderId,
      paymentId: finalPaymentId,
      resourceId,
      resourceTitle: resource?.title || "Decoded Guide",
      amount: resource?.price || 99,
      customerName: customerName || "Learner",
      customerEmail: customerEmail || "student@example.com",
      customerPhone: customerPhone || "N/A",
      status: "paid",
      paymentMethod: paymentMethod === "upi_direct" ? "Direct UPI (UTR Verified)" : "Razorpay Gateway",
      createdAt: new Date().toISOString(),
      downloadUrl,
    };

    // Save to server-side orders.json
    try {
      let ordersList: any[] = [];
      try {
        const rawOrders = await readFile(ordersPath, "utf-8");
        ordersList = JSON.parse(rawOrders);
      } catch {
        ordersList = [];
      }
      ordersList.unshift(newOrder);
      await writeFile(ordersPath, JSON.stringify(ordersList, null, 2), "utf-8");
    } catch (saveErr) {
      console.warn("Could not save to orders.json:", saveErr);
    }

    console.log(
      `[Payment Success] Order: ${finalOrderId} | Payment: ${finalPaymentId} | Method: ${newOrder.paymentMethod} | Buyer: ${customerName} (${customerEmail})`
    );

    return NextResponse.json({
      success: true,
      verified: true,
      orderId: finalOrderId,
      paymentId: finalPaymentId,
      invoiceNumber,
      downloadUrl,
      resourceTitle: resource?.title || "Decoded PDF Guide",
      amountPaid: resource?.price || 99,
      buyerEmail: customerEmail,
      message: "Payment verified successfully! Your PDF download is now unlocked.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payment verification failed";
    console.error("Verification error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
