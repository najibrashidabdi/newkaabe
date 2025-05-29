// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Only add rewrites if NEXT_PUBLIC_API is defined and points to a different origin
    // than the Next.js app itself (which is typical for development).
    // In production, if your Next.js app and API are behind the same domain/proxy,
    // you might not need these client-side rewrites, but the fetch URL would still be absolute.

    // The `source` path here is what the frontend will FETCH.
    // The `destination` is where Next.js will PROXY that request.
    // Since your frontend `fetch` now uses the full URL from `NEXT_PUBLIC_API`
    // for API calls (e.g., `http://127.0.0.1:8000/api/exam/dashboard/`),
    // rewrites for paths like `/api/:path*` that EXPECT the frontend to fetch
    // a relative path are no longer directly applicable in the same way.

    // IF YOU STILL FACE CORS ISSUES or want to keep frontend fetches relative (e.g. fetch('/api/exam/dashboard')):
    // You would use rewrites like this:
    if (process.env.NEXT_PUBLIC_API) {
      return [
        {
          source: "/api/:path*", // Frontend fetches '/api/exam/dashboard/'
          destination: `${process.env.NEXT_PUBLIC_API}/api/:path*`, // Next.js proxies to http://127.0.0.1:8000/api/exam/dashboard/
        },
      ];
    }
    return []; // No rewrites if NEXT_PUBLIC_API is not set
  },
};

export default nextConfig;
