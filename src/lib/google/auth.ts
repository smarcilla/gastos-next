import { OAuth2Client } from "googleapis";

async function getKeytar() {
  try {
    return await import("keytar");
  } catch {
    return null; // Edge runtime or missing native addon
  }
}

export const isKeytarAvailable = async () => !!(await getKeytar());

/**
 * Service wrapper around Google's OAuth2 client.
 */
export class GoogleAuthService {
  private client: OAuth2Client;
  private static readonly SERVICE = "gastos-next";
  private static readonly ACCOUNT = "default";

  /**
   * Create a new instance of GoogleAuthService.
   *
   * @param clientId - The OAuth2 client ID.
   * @param clientSecret - The OAuth2 client secret.
   * @param redirectUri - The redirect URI configured for the OAuth2 client.
   */
  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string,
  ) {
    this.client = new OAuth2Client({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
      redirectUri: this.redirectUri,
    });
    void (async () => {
      try {
        const refreshToken = await this.loadToken();
        if (refreshToken) {
          this.client.setCredentials({ refresh_token: refreshToken });
          await this.refreshIfNeeded();
        }
      } catch {
        /* ignore load errors */
      }
    })();
  }

  /**
   * Initiates the OAuth2 sign-in flow.
   *
   * @returns A promise that resolves with the authentication URL.
   */
  async signIn(): Promise<string> {
    return this.client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/userinfo.profile"],
    });
  }

  /**
   * Retrieves the current OAuth2 access token.
   *
   * @returns A promise that resolves with the access token string, or `null` if not available.
   */
  async getAccessToken(): Promise<string | null> {
    await this.refreshIfNeeded();
    return this.client.credentials.access_token ?? null;
  }

  /**
   * Refreshes the access token if it is expired or about to expire.
   *
   * @returns A promise that resolves once the token has been refreshed.
   */
  async refreshIfNeeded(): Promise<void> {
    const { refresh_token, expiry_date, access_token } =
      this.client.credentials;
    if (!refresh_token) {
      return;
    }
    const now = Date.now();
    if (!access_token || !expiry_date || expiry_date - now < 60_000) {
      const { credentials } = await this.client.refreshAccessToken();
      this.client.setCredentials(credentials);
      if (credentials.refresh_token) {
        await this.saveToken(credentials.refresh_token);
      }
    }
  }

  /**
   * Clears authentication credentials and revokes the token.
   *
   * @returns A promise that resolves when the user has been signed out.
   */
  async signOut(): Promise<void> {
    try {
      const token = this.client.credentials.access_token;
      if (token) {
        await this.client.revokeToken(token);
      }
    } catch {
      // ignore revoke errors
    }
    this.client.setCredentials({});
    const kt = await getKeytar();
    if (!kt) {
      console.warn("Keytar unavailable – skipping secure storage");
      return;
    }
    try {
      await kt.deletePassword(
        GoogleAuthService.SERVICE,
        GoogleAuthService.ACCOUNT,
      );
    } catch {
      /* ignore deletion errors */
    }
  }

  private async saveToken(refreshToken: string): Promise<void> {
    const kt = await getKeytar();
    if (!kt) {
      console.warn("Keytar unavailable – skipping secure storage");
      return;
    }
    try {
      await kt.setPassword(
        GoogleAuthService.SERVICE,
        GoogleAuthService.ACCOUNT,
        refreshToken,
      );
    } catch {
      /* ignore persistence errors */
    }
  }

  private async loadToken(): Promise<string | null> {
    const kt = await getKeytar();
    if (!kt) {
      console.warn("Keytar unavailable – skipping secure storage");
      return null;
    }
    try {
      return await kt.getPassword(
        GoogleAuthService.SERVICE,
        GoogleAuthService.ACCOUNT,
      );
    } catch {
      return null;
    }
  }
}

export async function verifyIdToken(
  idToken: string,
  clientId: string,
): Promise<{ email: string } | null> {
  try {
    const client = new OAuth2Client({ clientId });
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (payload?.email) return { email: payload.email };
  } catch {
    // ignore errors
  }
  return null;
}
