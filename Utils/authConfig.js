export const authConfig = {
  providers: [], // Keep this empty here
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      // Define your protected routes here
      const protectedPaths = ["/properties/add", "/profile", "/messages"];
      const isProtectedRoute = protectedPaths.some((path) =>
        nextUrl.pathname.startsWith(path)
      );

      if (isProtectedRoute && !isLoggedIn) {
        return false; // Redirect to login
      }
      return true;
    },
  },
};
