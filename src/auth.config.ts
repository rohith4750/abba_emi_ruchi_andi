import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.phone = (user as any).phone;
        token.username = (user as any).username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        (session.user as any).phone = token.phone;
        (session.user as any).username = token.username;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin");
      const isLoginRoute = nextUrl.pathname === "/admin/login";

      if (isAdminRoute && !isLoginRoute) {
        if (!isLoggedIn) return false; // Redirect to sign-in page
        
        // Check if user has ADMIN role
        if (auth.user?.role !== "ADMIN") {
          return Response.redirect(new URL("/", nextUrl)); // Redirect non-admins to home
        }
        return true;
      }
      
      if (isLoginRoute && isLoggedIn) {
        if (auth.user?.role === "ADMIN") {
          return Response.redirect(new URL("/admin", nextUrl));
        }
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with window/node-only config in auth.ts
} satisfies NextAuthConfig;
