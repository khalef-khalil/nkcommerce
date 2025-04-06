import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  
  // Check if the admin is trying to access admin routes without a token
  if (pathname.startsWith('/admin/tableau-de-bord') && !adminToken) {
    const url = new URL('/admin/connexion-admin', request.url);
    return NextResponse.redirect(url);
  }
  
  // If admin is authenticated and trying to access login page, redirect to dashboard
  if (pathname === '/admin/connexion-admin' && adminToken) {
    return NextResponse.redirect(new URL('/admin/tableau-de-bord', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 