/** @type {import('next').NextConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeDetection: false,
  },
  images: {
    domains: [
      'dev-redleaf-fands-bucket.s3.amazonaws.com',
      'prod-redleaf-fands-bucket.s3.amazonaws.com',
      'red-leaf-fands-qa.s3.eu-west-2.amazonaws.com',
      'dev-redleaf-fands-bucket.s3-us-west-2.amazonaws.com',
    ],
  },

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}
