"use client";

import { useSession } from "next-auth/react";

import { signIn, signOut } from "@/auth/helper";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Alert from '@/components/basic/Alert';

export default function AuthButtonClient() {
    const session = useSession();
    const router = useRouter();
    const [showAlert, setShowAlert] = useState(true);
    const [showError, setShowError] = useState(true);

    useEffect(() => {
        sessionStorage.setItem("user", session.data?.user?._id ?? "null")
        console.log(session);
        if (session.status != "authenticated") {
            console.log('not authenticated');
            router.push(`/auth/signIn?callbackUrl=${encodeURIComponent(window.location.href)}`);
        } else {
            console.log('authenticated');
        }
    }, [session, router]);
    return session?.data?.user ? (

        <Tooltip
            content={
                <div className="px-1 py-2">
                    <div className="text-tiny">Id : {session.data?.user?._id}</div>
                    <div className="text-tiny">User : {session.data?.user?.name}</div>
                    <div className="text-tiny">Email : {session.data?.user?.email}</div>
                    {/* <div className="text-tiny">Email : {session.data?.user?.id}</div> */}
                </div>
            }
        >
            <Button color="default" variant="flat" onClick={async () => {
                await signOut();
                await signIn();
                sessionStorage.removeItem("user");
            }}>

                {/* {session.data?.user?.email} : Sign Out */}
                Sign Out

            </Button>

        </Tooltip>
    ) : (
        <Button onClick={async () => {
            await signIn();
        }}>Sign In</Button>
    )

}