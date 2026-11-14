import { readFile, writeFile } from "fs/promises";
import path from "path";
import os from "os";

export interface GatewayConfig {
  upiId?: string;
  upiName?: string;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  preferredMethod?: string;
  isLive?: boolean;
  adminPassword?: string;
  updatedAt?: string;
}

// In-memory cache across serverless function invocations within the same container
const globalForConfig = globalThis as unknown as {
  __codedecoded_config?: GatewayConfig;
};

const bundledConfigPath = path.join(process.cwd(), "src", "data", "gatewayConfig.json");
const tempConfigPath = path.join(os.tmpdir(), "codedecoded-gateway-config.json");

/**
 * Retrieves the gateway and admin configuration.
 * Safe for serverless environments (Vercel, AWS Lambda) and local node environments.
 */
export async function getServerConfig(): Promise<GatewayConfig> {
  let config: GatewayConfig = {
    upiId: "codedecoded@upi",
    upiName: "Code Decoded",
    razorpayKeyId: "",
    razorpayKeySecret: "",
    preferredMethod: "both",
    isLive: false,
    adminPassword: "admin123",
  };

  // 1. Try reading bundled config
  try {
    const rawBundled = await readFile(bundledConfigPath, "utf-8");
    const parsed = JSON.parse(rawBundled);
    config = { ...config, ...parsed };
  } catch {
    // bundled file may be unavailable or unreadable
  }

  // 2. Try reading /tmp config (persisted runtime updates on serverless/Vercel)
  try {
    const rawTemp = await readFile(tempConfigPath, "utf-8");
    const parsedTemp = JSON.parse(rawTemp);
    config = { ...config, ...parsedTemp };
  } catch {
    // /tmp file might not exist yet
  }

  // 3. Merge with in-memory cache if present
  if (globalForConfig.__codedecoded_config) {
    config = { ...config, ...globalForConfig.__codedecoded_config };
  }

  // 4. Always respect process.env overrides
  if (process.env.ADMIN_PASSWORD) {
    config.adminPassword = process.env.ADMIN_PASSWORD;
  }
  if (process.env.UPI_ID) {
    config.upiId = process.env.UPI_ID;
  }
  if (process.env.UPI_NAME) {
    config.upiName = process.env.UPI_NAME;
  }
  if (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    config.razorpayKeyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      config.razorpayKeyId;
  }
  if (process.env.RAZORPAY_KEY_SECRET) {
    config.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  }

  return config;
}

/**
 * Persists updated configuration fields.
 * Gracefully handles read-only filesystems (EROFS) on Vercel/AWS Lambda by writing
 * to /tmp and updating runtime memory and environment variables.
 */
export async function saveServerConfig(
  updatedFields: Partial<GatewayConfig>
): Promise<GatewayConfig> {
  const current = await getServerConfig();
  const merged: GatewayConfig = {
    ...current,
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };

  // Update in-memory global cache
  globalForConfig.__codedecoded_config = merged;

  // Update process.env runtime
  if (merged.adminPassword) {
    process.env.ADMIN_PASSWORD = merged.adminPassword;
  }
  if (merged.razorpayKeyId) {
    process.env.RAZORPAY_KEY_ID = merged.razorpayKeyId;
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = merged.razorpayKeyId;
  }
  if (merged.razorpayKeySecret) {
    process.env.RAZORPAY_KEY_SECRET = merged.razorpayKeySecret;
  }
  if (merged.upiId) {
    process.env.UPI_ID = merged.upiId;
  }
  if (merged.upiName) {
    process.env.UPI_NAME = merged.upiName;
  }

  const payload = JSON.stringify(merged, null, 2);

  // 1. Try to write to project repo file (works in local dev, VPS, Docker)
  try {
    await writeFile(bundledConfigPath, payload, "utf-8");
  } catch (err: unknown) {
    // EROFS on Vercel / serverless environments is expected and handled safely
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      "[serverConfig] Project filesystem is read-only (e.g. Vercel serverless). Falling back to /tmp storage:",
      msg
    );
  }

  // 2. Always write to /tmp on serverless environments so other invocations on this container read it
  try {
    await writeFile(tempConfigPath, payload, "utf-8");
  } catch (tmpErr: unknown) {
    console.warn("[serverConfig] Could not write to /tmp:", tmpErr);
  }

  return merged;
}
