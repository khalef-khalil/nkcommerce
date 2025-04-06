import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected paths that require authentication
const protectedPaths = ['/profil', '/commandes'];
const adminPaths = ['/admin/tableau-de-bord'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // Admin trying to access protected admin routes without a token
    if (adminPaths.some(path => pathname.startsWith(path)) && !adminToken) {
      const url = new URL('/admin/connexion-admin', request.url);
      return NextResponse.redirect(url);
    }
    
    // If admin is authenticated and trying to access login page, redirect to dashboard
    if (pathname === '/admin/connexion-admin' && adminToken) {
      return NextResponse.redirect(new URL('/admin/tableau-de-bord', request.url));
    }
    
    return NextResponse.next();
  }
  
  // Handle regular user routes
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
    '/admin/:path*',
  ],
}; 