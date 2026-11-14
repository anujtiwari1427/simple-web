import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");

export async function GET() {
  try {
    const raw = await readFile(configPath, "utf-8");
    const config = JSON.parse(raw);

    // Return masked config
    return NextResponse.json({
      success: true,
      config: {
        upiId: config.upiId || "codedecoded@upi",
        upiName: config.upiName || "Code Decoded",
        razorpayKeyId: config.razorpayKeyId ? `${config.razorpayKeyId.slice(0, 8)}...` : "",
        hasRazorpayKey: Boolean(config.razorpayKeyId && config.razorpayKeySecret),
        rawRazorpayKeyId: config.razorpayKeyId || "",
        preferredMethod: config.preferredMethod || "both",
        isLive: Boolean(config.isLive),
      },
    });
  } catch (err: unknown) {
    return NextResponse.json({
      success: true,
      config: {
        upiId: "codedecoded@upi",
        upiName: "Code Decoded",
        hasRazorpayKey: false,
        rawRazorpayKeyId: "",
        preferredMethod: "both",
      },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { upiId, upiName, razorpayKeyId, razorpayKeySecret, preferredMethod } = body;

    let existing: any = {};
    try {
      const raw = await readFile(configPath, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      existing = {};
    }

    const updated = {
      ...existing,
      upiId: upiId || existing.upiId || "codedecoded@upi",
      upiName: upiName || existing.upiName || "Code Decoded",
      razorpayKeyId: razorpayKeyId !== undefined ? razorpayKeyId : existing.razorpayKeyId || "",
      razorpayKeySecret: razorpayKeySecret !== undefined ? razorpayKeySecret : existing.razorpayKeySecret || "",
      preferredMethod: preferredMethod || existing.preferredMethod || "both",
      isLive: Boolean(razorpayKeyId && !razorpayKeyId.includes("test")),
      updatedAt: new Date().toISOString(),
    };

    await writeFile(configPath, JSON.stringify(updated, null, 2), "utf-8");

    // Also update runtime process.env if provided
    if (updated.razorpayKeyId) {
      process.env.RAZORPAY_KEY_ID = updated.razorpayKeyId;
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = updated.razorpayKeyId;
    }
    if (updated.razorpayKeySecret) {
      process.env.RAZORPAY_KEY_SECRET = updated.razorpayKeySecret;
    }

    return NextResponse.json({
      success: true,
      message: "Payment gateway configuration saved successfully!",
      config: {
        upiId: updated.upiId,
        upiName: updated.upiName,
        hasRazorpayKey: Boolean(updated.razorpayKeyId && updated.razorpayKeySecret),
        preferredMethod: updated.preferredMethod,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update gateway settings";
    console.error("Gateway settings update error:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
