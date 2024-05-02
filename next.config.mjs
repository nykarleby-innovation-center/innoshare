/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/",
        destination: "/en",
      },
    ]
  },
  redirects() {
    return [
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
