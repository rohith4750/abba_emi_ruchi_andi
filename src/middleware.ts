import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Protect all /admin routes except for assets, api, etc.
  matcher: ["/admin/:path*"],
};
