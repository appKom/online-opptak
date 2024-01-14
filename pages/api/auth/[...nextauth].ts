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

        return {
          id: profile.sub,
          name: `${userInfo.first_name} ${userInfo.last_name}`,
          email: `${userInfo.online_mail}@online.ntnu.no`, // online_mail or mail?
        };
      },
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const userEmail = session.user.email;
        const isAdmin = userEmail ? adminEmails.includes(userEmail) : false;

        session.accessToken = token.accessToken as string;
        session.user.role = isAdmin ? "admin" : "user";

        if (token.id) {
          session.user.owId = token.id as string;
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
