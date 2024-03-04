// // app/providers.js
// "use client";
// import posthog from "posthog-js";
// import { PostHogProvider } from "posthog-js/react";

// if (typeof window !== "undefined") {
//   posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
//     autocapture: false,
//     capture_pageleave: false,
//     advanced_disable_decide: true,
//   });
// }
// export function CSPostHogProvider({ children }) {
//   return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
// }

"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

function shouldInitPostHog() {
  // Check if we're running on the client
  if (typeof window !== "undefined") {
    // Define paths to exclude from PostHog tracking
    const excludedPaths = ["/dashboard", "/sign-up", "/sign-in", "onboarding"];
    // Check the current path against the excluded paths
    return !excludedPaths.some((path) =>
      window.location.pathname.includes(path)
    );
  }
  return false;
}

if (shouldInitPostHog()) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    autocapture: false,
    capture_pageleave: false,
    advanced_disable_decide: true,
  });
}

export function CSPostHogProvider({ children }) {
  // Only provide PostHog context if we initialized PostHog
  return shouldInitPostHog() ? (
    <PostHogProvider client={posthog}>{children}</PostHogProvider>
  ) : (
    <>{children}</>
  );
}
