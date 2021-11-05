module.exports = {
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  images: {
    domains: ['red-leaf-fands-qa.s3.eu-west-2.amazonaws.com'],
  },

  /**
   * config to work with netlify in serverless
   */
  target: 'serverless',

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    HOMEPAGE: process.env.HOMEPAGE,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL
  }
}
