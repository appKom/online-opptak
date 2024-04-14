import NextAuth, { NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

export const authOptions: NextAuthOptions = {
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID || "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
      issuer: process.env.AUTH0_ISSUER,
      style: {
        logo: "/auth0.svg",
        logoDark: "/auth0-dark.svg",
        bg: "#fff",
        text: "#EB5424",
        bgDark: "#fff",
        textDark: "#161b22",
      },
      async profile(profile, tokens) {
        const apiUrl = "https://onlineweb.eu.auth0.com/userinfo";
        const headers = {
          Authorization: `Bearer ${tokens.access_token}`,
        };

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userInfo = await response.json();
        /* console.log("userInfo:");
        console.log(userInfo);
        console.log("profile:");
        console.log(profile); */

        return {
          id: profile.sub,
          name: profile.name,
          email: userInfo.email,
          //phone: userInfo.phone_number,
          //grade: userInfo.year,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // server side
    async jwt({ token, account, user }) {
      if (account && account.access_token) {
        token.accessToken = account?.access_token;
      }
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.grade = user.grade;
        token.role = adminEmails.includes(user.email) ? "admin" : "user";
      }
      return token;
    },
    // client side
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken as string;

        session.user.role = token.role as "admin" | "user";
        session.user.owId = token.id as string;
        session.user.phone = token.phone as string;
        session.user.grade = token.grade as number;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
