import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // يسمح بجلب الصور من أي رابط عبر الـ Wildcard (**)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // كود الـ Rewrites لحل مشكلة الكوكيز (Proxy)
  async rewrites() {
    return [
      {
        // سيقوم هذا الكود بتوجيه أي طلب يبدأ بـ /api-backend إلى سيرفر الباك إند الحقيقي
        source: '/api-backend/:path*',
        destination: 'https://platform-gamma-one.vercel.app/api/:path*', 
      },
    ];
  },
};

export default nextConfig;