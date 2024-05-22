import { User } from "next-auth";
import { auth } from "@/lib/auth";
import React from "react";
import { LoginButton, LogoutButton, ProfileButton } from "./buttons.component";
import Link from "next/link";

type Props = {
  user?: User;
};

const Navbar = async () => {
  const session = await auth();

  return <NavbarContainer user={session?.user as User} />;
};

const NavbarContainer = ({ user }: Props) => {
  const name =
    user?.name
      ?.split(" ")
      .map((e) => e.charAt(0))
      .join("") || "";

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          Dashboard
        </Link>
      </div>
      <div className="flex-none">
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar placeholder"
            >
              <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                <span>{name}</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <ProfileButton />
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <LogoutButton />
              </li>
            </ul>
          </div>
        )}
        {!user && <LoginButton />}
      </div>
    </div>
  );
};

export default Navbar;
