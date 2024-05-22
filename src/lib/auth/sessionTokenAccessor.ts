import { auth } from "@/lib/auth";
import { decrypt } from "../encryption";

export async function getAccessToken() {
  const session = await auth();
  if (session) {
    const accessTokenDecrypted = decrypt((session as any).access_token);
    // const accessTokenDecrypted = (session as any).access_token;
    return accessTokenDecrypted;
  }
  return null;
}

export async function getIdToken() {
  const session = await auth();
  if (session) {
    const idTokenDecrypted = decrypt((session as any).id_token);
    return idTokenDecrypted;
  }
  return null;
}
