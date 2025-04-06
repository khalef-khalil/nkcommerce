import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of protected paths that require authentication
const protectedPaths = ['/profil', '/commandes'];
const adminProtectedPaths = ['/admin/tableau-de-bord', '/admin/produits', '/admin/commandes', '/admin/statistiques'];
const adminPublicPaths = ['/admin/connexion', '/admin/deconnexion'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Redirect old admin URLs (with parentheses) to new ones
  if (pathname.startsWith('/(admin)')) {
    const newPath = pathname.replace('/(admin)', '/admin');
    return NextResponse.redirect(new URL(newPath, request.url));
  }
  
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    // Admin trying to access protected admin routes without a token
    if (!adminPublicPaths.includes(pathname) && !adminToken) {
      const url = new URL('/admin/connexion', request.url);
      return NextResponse.redirect(url);
    }
    
    // If admin is authenticated and trying to access login page, redirect to dashboard
    if (pathname === '/admin/connexion' && adminToken) {
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
    '/(admin)/:path*',
  ],
}; 