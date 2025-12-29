import NextAuth from "next-auth";
import { authConfig } from "./Utils/authConfig";

export default NextAuth(authConfig).auth;

export const config = {
  // Update this matcher to include your protected routes
  matcher: ["/properties/add", "/profile", "/messages"],
};
