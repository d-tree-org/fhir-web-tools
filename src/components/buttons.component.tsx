"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
  return (
    <button className="btn" onClick={() => signIn()}>
      Sign in
    </button>
  );
};

export const LogoutButton = () => {
  return <a onClick={() => signOut()}>Sign Out</a>;
};

export const ProfileButton = () => {
  return (
    <Link href="/profile" className="justify-between">
      Profile
    </Link>
  );
};
