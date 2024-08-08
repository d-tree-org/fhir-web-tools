import CryptoJS from "crypto-js";

export function encrypt(text: any) {
  const secretKey = process.env.NEXTAUTH_SECRET ?? "secret";
  const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
  return ciphertext;
}

export function decrypt(encryptedString: any) {
  const secretKey = process.env.NEXTAUTH_SECRET ?? "secret";
  const bytes = CryptoJS.AES.decrypt(encryptedString, secretKey);
  const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}
