import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const configPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required." },
        { status: 400 }
      );
    }

    // Read stored password or env
    let storedPassword = process.env.ADMIN_PASSWORD || "admin123";
    try {
      const raw = await readFile(configPath, "utf-8");
      const config = JSON.parse(raw);
      if (config.adminPassword) {
        storedPassword = config.adminPassword;
      }
    } catch {}

    if (password !== storedPassword) {
      return NextResponse.json(
        { success: false, error: "Incorrect admin password. Please try again." },
        { status: 401 }
      );
    }

    // Generate a secure session token
    const token = crypto
      .createHash("sha256")
      .update(`${storedPassword}-${new Date().toISOString().slice(0, 10)}`)
      .digest("hex");

    const response = NextResponse.json({
      success: true,
      message: "Admin authentication successful.",
    });

    // Set secure cookie
    response.cookies.set("codedecoded_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Login error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
