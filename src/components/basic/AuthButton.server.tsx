"use client";

import { SessionProvider } from "next-auth/react";
import AuthButtonClient from "./AuthButton.client";

export default function AuthButton({ session }: { session: any }) {
  return (
    <SessionProvider session={session}>
      <AuthButtonClient session={session} />
    </SessionProvider>
  );
}