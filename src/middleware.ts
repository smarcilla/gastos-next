import { NextRequest, NextResponse } from "next/server";
import { GoogleAuthService } from "@/lib/google/auth";

const googleAuthService = new GoogleAuthService(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  process.env.GOOGLE_REDIRECT_URI || "",
);

function parseEmail(token: string): string | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const padded = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = Buffer.from(padded, "base64").toString();
    const { email } = JSON.parse(json);
    return email || null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  void req;
  const token = await googleAuthService.getAccessToken();
  const email = token ? parseEmail(token) : null;

  if (!token || !email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const res = NextResponse.next();
  res.headers.set("x-user-email", email);
  return res;
}

export const matcher = ["/api/:path*"];
export { googleAuthService };
