import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Timestamp, serverTimestamp } from "firebase/firestore";

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    // Add OAuth authentication provider
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      session.user.timestamp = new Date();
      return session;
    },
  },

  secret: process.env.SECRET,
});
