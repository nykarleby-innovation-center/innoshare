/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
    domains: ["innosharestorage.blob.core.windows.net"],
  },
}

export default nextConfig
