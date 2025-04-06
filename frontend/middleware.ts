import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected paths that require authentication
const protectedPaths = ['/profil', '/commandes'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  
  // Check if the path is protected and user is not authenticated
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    const url = new URL('/connexion', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // If user is authenticated and trying to access login/register pages, redirect to profile
  if ((pathname === '/connexion' || pathname === '/inscription') && token) {
    return NextResponse.redirect(new URL('/profil', request.url));
  }
  
  return NextResponse.next();
}

// Configure matcher for which paths the middleware should run on
export const config = {
  matcher: [
    '/profil/:path*',
    '/commandes/:path*',
    '/connexion',
    '/inscription',
  ],
}; 