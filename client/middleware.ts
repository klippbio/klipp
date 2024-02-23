import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  // Add afterAuth to handle custom redirection
  afterAuth: ({ userId, isPublicRoute }, req) => {
    // Check if the user is not authenticated and trying to access a protected route
    if (!userId && !isPublicRoute) {
      // Redirect unauthenticated user to the sign-in page
      return redirectToSignIn({ returnBackUrl: req.url });
    }
  },
  // Assuming all routes are protected except explicitly mentioned as public
  publicRoutes: ["((?!^/dashboard/).*)"],
  ignoredRoutes: ["/"],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
