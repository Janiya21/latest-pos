import { auth } from "@/auth";
import AuthButton from "./AuthButton.server";

export default async function UseAuth() {
  const session = await auth();
  const sanitizedSession = session?.user
    ? {
        user: {
          name: session.user.name,
          id: session.user.id,
        },
      }
    : null;

  return <AuthButton session={sanitizedSession} />;
}
