import { NextRequest, NextResponse } from "next/server";
import { getServerConfig, saveServerConfig } from "@/lib/serverConfig";

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: "New passcode must be at least 4 characters long." },
        { status: 400 }
      );
    }

    const currentConfig = await getServerConfig();
    const currentActual = currentConfig.adminPassword || "admin123";

    if (currentPassword !== currentActual) {
      return NextResponse.json(
        { success: false, error: "Current passcode does not match. (Default is admin123)" },
        { status: 400 }
      );
    }

    await saveServerConfig({ adminPassword: newPassword });

    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

    return NextResponse.json({
      success: true,
      message: isServerless
        ? "Admin passcode updated successfully for this deployment! (Tip: You can also set ADMIN_PASSWORD in your Vercel Project Settings for permanent persistence across all instances)"
        : "Admin passcode successfully changed!",
      isServerless,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error changing passcode";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
