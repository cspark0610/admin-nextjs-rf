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
}
