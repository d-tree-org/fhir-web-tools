import NextAuth from "next-auth";

import "next-auth/jwt";
import KeycloakProvider, {
  KeycloakProfile,
} from "next-auth/providers/keycloak";
import { encrypt } from "@/lib/encryption";
import jwt_decode from "jwt-decode";
import type { NextAuthConfig } from "next-auth";
import "next-auth/jwt";
import { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT) {
  console.log("refreshing");

  const resp = await fetch(`${process.env.KEYCLOAK_REFRESH_TOKEN_URL}`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_ID,
      client_secret: process.env.KEYCLOAK_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
    } as Record<string, string>),
    method: "POST",
  });
  const refreshToken = await resp.json();
  if (!resp.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    decoded: jwt_decode(refreshToken.access_token),
    id_token: refreshToken.id_token,
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

export const configs = {
  providers: [
    KeycloakProvider<KeycloakProfile>({
      clientId: process.env.KEYCLOAK_ID ?? "",
      clientSecret: process.env.KEYCLOAK_SECRET ?? "",
      issuer: process.env.KEYCLOAK_ISSUER,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name ?? profile.preferred_username,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const nowTimeStamp = Math.floor(Date.now() / 1000);

      if (account) {
        // account is only available the first time this callback is called on a new session (after the user signs in)
        token.decoded = jwt_decode(account.access_token ?? "");
        token.access_token = account.access_token;
        token.id_token = account.id_token;
        token.expires_at = account.expires_at;
        token.refresh_token = account.refresh_token;
        return token;
      } else if (nowTimeStamp < (token.expires_at as any)) {
        // token has not expired yet, return it
        return token;
      } else {
        // token is expired, try to refresh it
        console.log("Token has expired. Will refresh...");
        try {
          const refreshedToken = await refreshAccessToken(token);
          console.log("Token is refreshed.");
          return refreshedToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
    },
    async session({ session, token }) {
      // Send properties to the client
      (session as any).access_token = encrypt(token.access_token); // see utils/sessionTokenAccessor.js
      (session as any).id_token = encrypt(token.id_token); // see utils/sessionTokenAccessor.js
      (session as any).roles = (token as any).decoded.realm_access.roles;
      (session as any).error = token.error;
      return session;
    },
  },
  debug: false,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(configs);

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
