import { BASE_PATH, auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import AuthButtonClient from "./AuthButton.client";

export default async function AuthButton() {
 const session = await auth();
 if(session && session.user){
    session.user = {
        _id : session.user._id,
        name : session.user.name,
        email : session.user.email,
        id: session.user.id
    }
 }
 return (
  <SessionProvider basePath={BASE_PATH} session={session}>
    <AuthButtonClient />
  </SessionProvider>
 );
}