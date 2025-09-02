"use server";

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";

const protectedRoutes = ["/dashboard", "/dashboard-v2", "/task-manager", "/ai-consultant", "/version-history", "/drafts", "/books", "/book-editor-v2"];
const publicRoutes = ["/signin", "/register", "/forgot-password"];

export default async function middleware(req: NextRequest)
{
    const path = req.nextUrl.pathname;    

    const isProtectedRoute = protectedRoutes.includes(path);    
    const isPublicRoute = publicRoutes.includes(path);

    const sessionCookie = req.cookies.get("session")?.value;    
    const session = await decrypt(sessionCookie);

    if (isProtectedRoute && !session)
    {
        return NextResponse.redirect(new URL("/signin", req.nextUrl));
    }

    if (isPublicRoute && session)
    {
        return NextResponse.redirect(new URL("/dashboard-v2", req.nextUrl));
    }

    return NextResponse.next();
    
}
