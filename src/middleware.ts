import { NextRequest, NextResponse } from "next/server";
import { verifyIdToken } from "@/lib/google/auth";

export async function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const verified = token
    ? await verifyIdToken(token, process.env.GOOGLE_CLIENT_ID || "")
    : null;

  if (!verified) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const res = NextResponse.next();
  res.headers.set("x-user-email", verified.email);
  return res;
}

export const matcher = ["/api/:path*"];
