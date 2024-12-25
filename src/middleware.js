import { NextResponse } from 'next/server';
import { BASE_PATH, auth } from "@/auth";

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

if (!NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not defined in your environment variables');
}

export async function middleware(req) {
    const session = await auth(); // Check for session
    const url = req.nextUrl.clone();

    console.log(session);
    console.log(url.pathname);
    console.log("<>");

    // Redirect to sign in page if no session is found for any protected route
    if (!session && url.pathname !== '/auth/signin') {
        url.pathname = '/auth/signin';
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from the sign-in page
    if (session && url.pathname === '/auth/signin') {
        url.pathname = '/'; // Redirect to homepage
        return NextResponse.redirect(url);
    }

    return NextResponse.next(); // Allow access to all other cases
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // Apply middleware to all routes
};
