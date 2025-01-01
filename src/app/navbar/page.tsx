"use client";
import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import {Avatar} from "@nextui-org/react";
import {User} from "@nextui-org/react";
import AuthButton from "@/components/basic/AuthButton.server";

export default function NavBarUI() {
  return (
    <Navbar style={{backgroundColor:"white"}} className="md:py-4 md:pb-10 pb-4 border-1 z-30 rounded-xl">
      <NavbarBrand className="">
       <h2 className="text-3xl font-bold">NBM</h2>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
      </NavbarContent>
      <NavbarContent justify="end">
        
        <div className="md:flex gap-3 items-center hidden">
            <Avatar className="p-3" src="https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png" />
        </div>
        <NavbarItem className="mt-4 md:mt-0">
            {/* <AuthButton /> */}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
