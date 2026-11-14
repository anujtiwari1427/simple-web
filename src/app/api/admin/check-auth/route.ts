import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const configPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("codedecoded_admin_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    let storedPassword = process.env.ADMIN_PASSWORD || "admin123";
    try {
      const raw = await readFile(configPath, "utf-8");
      const config = JSON.parse(raw);
      if (config.adminPassword) {
        storedPassword = config.adminPassword;
      }
    } catch {}

    const expectedToken = crypto
      .createHash("sha256")
      .update(`${storedPassword}-${new Date().toISOString().slice(0, 10)}`)
      .digest("hex");

    if (token === expectedToken) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
