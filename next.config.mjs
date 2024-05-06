/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  //outputFileTracingRoot: path.join(__dirname, './src//'),
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
