import { NextResponse } from "next/server";
import { auth } from "@/nextauth";

export const middleware = auth((req) => {
  const email = req.auth?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const res = NextResponse.next();
  res.headers.set("x-user-email", email);
  return res;
});

export const config = { matcher: ["/api/:path*"] };
