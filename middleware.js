import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token from cookies
  const token = request.cookies.get("token")?.value;

  // Calculate token expiration time (5 minutes from creation)
  const tokenCreationTime = request.cookies.get("token_creation_time")?.value;
  const tokenExpirationTime = tokenCreationTime
    ? Number(tokenCreationTime) + 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
    : null;
  const currentTime = new Date().getTime();

  // Check if the token is expired
  if (tokenExpirationTime && currentTime > tokenExpirationTime) {
    // Clear the token and user info cookies
    // const response = NextResponse.redirect(new URL(pathname, request.url)); // Redirect to the same page
    response.cookies.delete("token");
    response.cookies.delete("user-info");

    // Set a flag to indicate that the token was cleared

    // Log to the server console

    return response;
  }

  // Redirect authenticated users away from the login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/sidebar/profile", request.url));
  }

  // Redirect authenticated users away from restricted routes
  const restrictedRoutes = [
    "/enterPassword",
    "/verifyUser",
    "/SendVerificationCode",
  ];
  if (restrictedRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/sidebar/profile", request.url));
  }

  // Redirect unauthenticated users away from protected routes
  const protectedRoutes = [
    "/sidebar/profile",
    "/sidebar/my-orders",
    "/sidebar/quotation",
  ]; // Add your protected routes here
  if (protectedRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Continue to the requested page
  return NextResponse.next();
}

// Specify the routes to apply this middleware
export const config = {
  matcher: [
    "/login", // Apply middleware to the login page
    "/enterPassword", // Apply middleware to the enterPassword route
    "/verifyUser", // Apply middleware to the verifyUser route
    "/SendVerificationCode", // Apply middleware to the SendVerificationCode route
    "/sidebar/:path*", // Apply middleware to all sidebar routes
    "/dashboard/:path*", // Apply middleware to all dashboard routes
    "/profile/:path*", // Apply middleware to all profile routes
    "/mainpage", // Apply middleware to the mainpage route
  ],
};
