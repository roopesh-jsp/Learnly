import { NextResponse } from "next/server";

import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import {
  apiPrefixRoutes,
  authRoutes,
  privateRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;
  const isApiAuthRoute = pathname.startsWith(apiPrefixRoutes[0]);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isPrivateRoute = privateRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isApiAuthRoute) return null;
  if (isAuthRoute) {
    if (isLoggedIn) return Response.redirect(new URL("/", req.nextUrl));
    return null;
  }

  if (!isLoggedIn && !isPublicRoute)
    return Response.redirect(new URL("/signup", req.nextUrl));
  return null;
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/", // home page
    "/api/(.*)", // all API routes
  ],
};
