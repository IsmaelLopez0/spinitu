/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'spinitu-dev-images-12052024.s3.us-east-1.amazonaws.com',
        pathname: '**',
      },
    ],
  },
};
