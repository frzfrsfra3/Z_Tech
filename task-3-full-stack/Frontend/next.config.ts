import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
 // reactStrictMode: true,
  images: {
    domains: ['tutorteach.ca','images.leadconnectorhq.com','tw-production.s3.amazonaws.com','storage.googleapis.com'], // Add the external image domain
  }
 
};

export default nextConfig;
