import axios from "axios";
import * as otplib from "otplib";

/**
 * Custom Minimal AngelOne Client to avoid 'electron' / 'got' dependency issues
 * in Next.js/Turbopack environments.
 */
export class AngelOneClient {
  private apiKey: string;
  private jwtToken: string | null = null;
  private refreshToken: string | null = null;
  private feedToken: string | null = null;
  private lastLoginTime: number = 0;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ANGELONE_API_KEY || "";
  }

  async login() {
    // Session caching (1 hour)
    if (this.jwtToken && (Date.now() - this.lastLoginTime < 3600000)) {
      return { jwtToken: this.jwtToken, feedToken: this.feedToken };
    }

    try {
      const clientCode = process.env.ANGELONE_CLIENT_CODE || "";
      const password = process.env.ANGELONE_PASSWORD || "";
      const totpSecret = process.env.ANGELONE_TOTP_SECRET || "";
      
      if (!totpSecret) throw new Error("TOTP Secret is missing");

      // Handle both ESM and CJS otplib exports
      const authenticator = (otplib as any).authenticator || otplib;
      const totp = authenticator.generate(totpSecret);

      const response = await axios.post(
        "https://apiconnect.angelbroking.com/rest/auth/angelbroking/user/v1/loginByPassword",
        { clientcode: clientCode, password: password, totp: totp },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-UserType": "USER",
            "X-SourceID": "WEB",
            "X-ClientLocalIP": "192.168.1.1",
            "X-ClientPublicIP": "106.193.147.210",
            "X-MACAddress": "fe80::216:3eff:fe35:33a0",
            "X-PrivateKey": this.apiKey,
          },
        }
      );

      if (response.data.status) {
        this.jwtToken = response.data.data.jwtToken;
        this.refreshToken = response.data.data.refreshToken;
        this.feedToken = response.data.data.feedToken;
        this.lastLoginTime = Date.now();
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      console.error("AngelOne Login Error:", msg);
      throw new Error(msg);
    }
  }

  async getLTP(exchange: string, tradingsymbol: string, symboltoken: string) {
    await this.login();

    try {
      const response = await axios.post(
        "https://apiconnect.angelbroking.com/rest/utils/financial/marketData/v1/ltp",
        {
          exchange,
          tradingsymbol,
          symboltoken,
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-UserType": "USER",
            "X-SourceID": "WEB",
            "X-PrivateKey": this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      throw new Error(msg);
    }
  }
}

// Global instance to persist across HMR
const globalForAngel = global as unknown as { angelOne: AngelOneClient };
export const angelOne = globalForAngel.angelOne || new AngelOneClient();

if (process.env.NODE_ENV !== "production") globalForAngel.angelOne = angelOne;
