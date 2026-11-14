import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const configPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");

export async function POST(req: NextRequest) {
  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 4) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    let existing: any = {};
    try {
      const raw = await readFile(configPath, "utf-8");
      existing = JSON.parse(raw);
    } catch {
      existing = {};
    }

    const currentActual = existing.adminPassword || process.env.ADMIN_PASSWORD || "admin123";

    if (currentPassword !== currentActual) {
      return NextResponse.json(
        { success: false, error: "Current password does not match." },
        { status: 400 }
      );
    }

    existing.adminPassword = newPassword;
    await writeFile(configPath, JSON.stringify(existing, null, 2), "utf-8");

    process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({
      success: true,
      message: "Admin password successfully changed!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error changing password";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
