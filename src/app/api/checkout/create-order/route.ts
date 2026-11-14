import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import { initialResources } from "@/data/resourcesData";
import { readFile } from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");

export async function POST(req: NextRequest) {
  try {
    const { resourceId, customerName, customerEmail, customAmount } = await req.json();

    if (!resourceId) {
      return NextResponse.json(
        { success: false, error: "Resource ID is required." },
        { status: 400 }
      );
    }

    // Lookup resource
    const resource = initialResources.find(r => r.id === resourceId);
    let amountInRupees = resource?.price || customAmount || 99;

    if (amountInRupees <= 0) {
      return NextResponse.json(
        { success: false, error: "Resource is free or invalid amount." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amountInRupees * 100);

    // Read config from file or env
    let fileConfig: any = {};
    try {
      const raw = await readFile(configPath, "utf-8");
      fileConfig = JSON.parse(raw);
    } catch {
      fileConfig = {};
    }

    const keyId =
      fileConfig.razorpayKeyId ||
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = fileConfig.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
    const upiId = fileConfig.upiId || "codedecoded@upi";
    const upiName = fileConfig.upiName || "Code Decoded";

    // Check if live or test Razorpay credentials exist
    if (keyId && keySecret && !keyId.includes("placeholder")) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const options = {
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${resourceId.slice(0, 10)}_${Date.now().toString().slice(-6)}`,
          notes: {
            resourceId,
            resourceTitle: resource?.title || "Code Decoded PDF",
            customerName: customerName || "Learner",
            customerEmail: customerEmail || "student@example.com",
          },
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId,
          isMock: false,
          resourceTitle: resource?.title,
          upiId,
          upiName,
        });
      } catch (razorpayErr: unknown) {
        console.warn("Razorpay API call failed:", razorpayErr);
      }
    }

    // Fallback Mock Order ID
    const mockOrderId = `order_cd_${crypto.randomBytes(8).toString("hex")}`;

    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      keyId: keyId || "rzp_test_codedecoded",
      isMock: true,
      resourceTitle: resource?.title || "Code Decoded Premium PDF",
      upiId,
      upiName,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to initialize payment order";
    console.error("Order creation error:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
