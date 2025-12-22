/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: "standalone",
  //outputFileTracingRoot: path.join(__dirname, './src//'),
  rewrites() {
    return [
      {
        source: "/",
        destination: "/sv",
      },
    ]
  },
  redirects() {
    return [
      {
        source: "/sv",
        destination: "/",
        permanent: true,
      },
    ]
  },
  images: {
    domains: ["innosharestorage.blob.core.windows.net", "r3v4sxoyn4vwvvvt.public.blob.vercel-storage.com"],
  },
}

export default nextConfig
