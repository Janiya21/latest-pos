import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const BASE_PATH = "/api/auth";

const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },
        authorize: (credentials) => {
          // Add your custom logic for authentication here
          if (credentials?.username === "admin" && credentials.password === "1212") {
            return { id: "1", name: "Admin User" };
          }
          return null;
        },
      })
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Redirect to the specified URL after successful login
      return baseUrl + '/'; // Change '/dashboard' to your desired route
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  basePath: BASE_PATH,
  secret: process.env.NEXTAUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);