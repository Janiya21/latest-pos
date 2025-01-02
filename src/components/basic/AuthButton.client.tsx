

import { useSession } from "next-auth/react";

import { signIn, signOut } from "@/auth/helper";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthButtonClient({ session }: { session: any }) {
    if (!session) {
      return <button>Login</button>;
    }
  
    return (
      <div>
        <p>Welcome, {session.user.name}</p>
        <button>Logout</button>
      </div>
    );
  }