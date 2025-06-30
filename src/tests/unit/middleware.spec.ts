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
jest.mock("@/lib/google/auth", () => {
  return {
    GoogleAuthService: jest.fn().mockImplementation(() => ({
      getAccessToken: jest.fn(),
    })),
  };
});

import { middleware, googleAuthService } from "@/middleware";
import { NextRequest } from "next/server";

// Jest unit tests for the middleware

describe("middleware", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("returns 401 when token missing", async () => {
    jest.spyOn(googleAuthService, "getAccessToken").mockResolvedValueOnce(null);
    const req = new NextRequest();
    const res = await middleware(req);
    expect(res.status).toBe(401);
  });

  it("sets header on success", async () => {
    const payload = { email: "user@example.com" };
    const token = `a.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.c`;
    jest
      .spyOn(googleAuthService, "getAccessToken")
      .mockResolvedValueOnce(token);
    const req = new NextRequest();
    const res = await middleware(req);
    expect(res.headers.get("x-user-email")).toBe("user@example.com");
  });
});
