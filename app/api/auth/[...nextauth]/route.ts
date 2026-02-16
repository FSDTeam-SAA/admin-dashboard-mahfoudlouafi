export const runtime = "nodejs";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const apiBaseUrl =
  process.env.NEXTPUBLICBASEURL || process.env.NEXT_PUBLIC_BASE_URL || "";

async function loginRequest(payload: { email: string; password: string }) {
  if (!apiBaseUrl) {
    throw new Error("Missing API base URL");
  }

  const response = await fetch(`${apiBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });

  if (!response.ok) {
    let message = "Invalid credentials";
    try {
      const data = await response.json();
      message = data?.message || data?.error || message;
    } catch {}
    throw new Error(message);
  }

  const data = await response.json();
  return data?.data;
}

const { handlers } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  trustHost: true,
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;
        try {
          const data = await loginRequest({
            email,
            password
          });

          const user = data?.user;
          const accessToken = data?.accessToken;

          if (!user || !accessToken) return null;

          return {
            ...user,
            accessToken
          };
        } catch {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.user = {
          _id: (user as { _id?: string })._id,
          role: (user as { role?: string }).role,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      session.user = {
        ...session.user,
        _id: token.user?._id,
        role: token.user?.role
      };
      session._id = token.user?._id;
      session.role = token.user?.role;
      return session;
    }
  }
});

export const { GET, POST } = handlers;
