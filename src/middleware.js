export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/builder/:path*', '/account/:path*', '/admin/:path*'],
};
