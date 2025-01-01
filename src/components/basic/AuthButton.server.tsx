import { BASE_PATH, auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import AuthButtonClient from "./AuthButton.client";

export default async function AuthButton() {
 const session = await auth();
 if(session && session.user){
    session.user = {
        name : session.user.name,
        id: session.user.id
    }
 }  
 return (
  <SessionProvider basePath={BASE_PATH} session={session}>
    <AuthButtonClient />
  </SessionProvider>
 );
}