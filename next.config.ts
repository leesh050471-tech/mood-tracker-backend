import type { NextConfig } from "next";

// 프론트엔드(다른 출처)에서 호출할 수 있도록 CORS 허용 출처를 환경변수로 받음
const allowedOrigin = process.env.ALLOWED_ORIGIN ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: allowedOrigin },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type" },
        ],
      },
    ];
  },
};

export default nextConfig;
