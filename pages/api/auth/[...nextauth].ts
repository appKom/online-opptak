import NextAuth, { NextAuthOptions } from "next-auth";

const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "ow4",
      name: "Online Web 4 Authorization",
      type: "oauth",
      authorization: {
        params: { scope: "openid profile onlineweb4" },
      },
      clientSecret: process.env.OW_CLIENT_SECRET,
      clientId: process.env.OW_CLIENT_ID,
      wellKnown:
        "https://old.online.ntnu.no/openid/.well-known/openid-configuration",
      async profile(profile, tokens) {
        const apiUrl = "https://old.online.ntnu.no/api/v1/profile/";
        const headers = {
          Authorization: `Bearer ${tokens.access_token}`,
        };

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const userInfo = await response.json();
        console.log(userInfo);

        return {
          id: profile.sub,
          name: `${userInfo.first_name} ${userInfo.last_name}`,
          email: userInfo.email,
          phone: userInfo.phone_number,
          grade: userInfo.year,
        };
      },
    },
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
