"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";

export default function NavBarUI() {
  const { data: session } = useSession();

  return (
    <Navbar style={{ backgroundColor: "white" }} className="md:py-4 md:pb-10 pb-4 border-1 z-30 rounded-xl">
      <NavbarBrand>
        <h2 className="text-3xl font-bold">NBM</h2>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center"></NavbarContent>
      <NavbarContent justify="end">
        {session ? (
          <div className="md:flex gap-3 items-center hidden">
            <Avatar
              className="p-3"
              src={"https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"}
            />
            <span className="font-semibold">{session.user?.name || "User"}</span>
            <Button onClick={() => signOut()} color="danger" size="sm">
              Logout
            </Button>
          </div>
        ) : (
          <NavbarItem className="mt-4 md:mt-0">
            <Button onClick={() => signIn()} color="primary" size="sm">
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
