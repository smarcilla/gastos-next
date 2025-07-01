import { jest } from "@jest/globals";

// Mock the next/server module to avoid requiring Next.js runtime
jest.mock("next/server", () => {
  class MockNextRequest {
    constructor(public request?: unknown) {}
  }
  class MockResponse {
    status = 200;
    headers = new Headers();
  }
  return {
    NextResponse: {
      next: () => new MockResponse(),
      json: (_body: unknown, init?: { status?: number }) => {
        const res = new MockResponse();
        if (init?.status) res.status = init.status;
        return res;
      },
    },
    NextRequest: MockNextRequest,
  };
});

// Mock GoogleAuthService to avoid importing googleapis
let authSession: unknown = null;
jest.mock("@/nextauth", () => {
  return {
    auth: (handler: (req: { auth?: unknown }) => unknown) => {
      return (req: unknown) =>
        handler({ ...(req as object), auth: authSession });
    },
  };
});

import { middleware } from "@/middleware";
import { NextRequest } from "next/server";

// Jest unit tests for the middleware

describe("middleware", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    authSession = null;
  });

  it("returns 401 when token missing", async () => {
    authSession = null;
    const req = new NextRequest();
    const res = await middleware(req);
    expect(res.status).toBe(401);
  });

  it("sets header on success", async () => {
    authSession = { user: { email: "user@example.com" } };
    const req = new NextRequest();
    const res = await middleware(req);
    expect(res.headers.get("x-user-email")).toBe("user@example.com");
  });
});
