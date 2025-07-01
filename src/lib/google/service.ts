import { GoogleAuthService } from "./auth";

export const googleAuthService = new GoogleAuthService(
  process.env.GOOGLE_CLIENT_ID || "",
  process.env.GOOGLE_CLIENT_SECRET || "",
  process.env.GOOGLE_REDIRECT_URI || "",
);
