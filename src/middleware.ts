import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(req:NextRequest){
  if(req.nextUrl.pathname.startsWith('/super-admin')){
    const token=req.cookies.get('derbii_admin_token')?.value;
    if(!token && !req.nextUrl.pathname.endsWith('/login')) return NextResponse.redirect(new URL('/super-admin/login', req.url));
  }
  return NextResponse.next();
}
export const config={matcher:['/super-admin/:path*']};
