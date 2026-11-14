import { NextRequest, NextResponse } from "next/server";
import { getServerConfig, saveServerConfig } from "@/lib/serverConfig";

export async function GET() {
  try {
    const config = await getServerConfig();

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
  } catch {
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

    const current = await getServerConfig();

    const updated = await saveServerConfig({
      upiId: upiId || current.upiId || "codedecoded@upi",
      upiName: upiName || current.upiName || "Code Decoded",
      razorpayKeyId: razorpayKeyId !== undefined ? razorpayKeyId : current.razorpayKeyId || "",
      razorpayKeySecret:
        razorpayKeySecret !== undefined ? razorpayKeySecret : current.razorpayKeySecret || "",
      preferredMethod: preferredMethod || current.preferredMethod || "both",
      isLive: Boolean(razorpayKeyId && !razorpayKeyId.includes("test")),
    });

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
