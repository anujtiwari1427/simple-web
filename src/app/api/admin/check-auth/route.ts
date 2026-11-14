import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerConfig } from "@/lib/serverConfig";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("codedecoded_admin_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    const config = await getServerConfig();
    const storedPassword = config.adminPassword || "admin123";

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
