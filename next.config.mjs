import MillionLint from '@million/lint';
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/coaches',
        headers: [
          {
            key: 'Cache-Control',
            value: 's-maxage=0, stale-while-revalidate=0',
          },
        ],
      },
    ];
  },
};
export default MillionLint.next({
  rsc: true,
})(nextConfig);
