import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/config/database";
import User from "@/models/User";
import { authConfig } from "./authConfig";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig, // Spread the config to inherit the authorized callback
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // We can keep the authorized callback from authConfig,
    // or overwrite it if needed (usually not needed).
    ...authConfig.callbacks,

    // Database logic stays HERE (Node.js environment)
    async signIn({ profile }) {
      await connectDB();
      const userExists = await User.findOne({ email: profile.email });
      if (!userExists) {
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      return true;
    },
    async session({ session }) {
      await connectDB(); // Ensure DB is connected for session checks
      const user = await User.findOne({ email: session.user.email });
      if (user) {
        session.user.id = user._id.toString();
      }
      return session;
    },
  },
});
