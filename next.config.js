module.exports = {
  eslint: {
    ignoreDuringBuilds: true
  },
  // images: {
  //   formats: ['image/avif', 'image/webp'], // Only include supported formats here
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'cdn.shopify.com',
  //       pathname: '/s/files/**'
  //     }
  //   ]
  // },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};
