// main tools
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import AuthService from '../../../src/services/Auth'

const options = {
  pages: {
    error: '/login'
  },
  database: null,
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },

      /**
       * function where should be the authentication logic for return
       * a succesfull login data or false/null if the credentials are invalid.
       * @param {{csrfToken, email, password }} credentials
       */
      async authorize(credentials) {
        const response = await AuthService.login(credentials)

        if (response.token)
          return {
            token: response.token,
            ...response.user,
            name: `${response.user.last_name}`,
        }
        else return null
      },
    }),
  ],

  callbacks: {
    /**
     *
     * @param {object} token decrypted jwt
     * @param {object} user user received afther authorize method
     * @param {object} account provider account
     * @param {object} profile provider profile
     * @param {boolean} isNewUser true if new user
     *
     * @return {object} jwt that will be send to session callback
     */
    jwt: async (token, data) => {
      if (data) {
        const response = {}

        response.user = { ...data, token }
        response.token = data.token
        
        token = { ...response }
      }
      return Promise.resolve(token)
    },

    /**
     *
     * @param {object} session current session object
     * @param {object} token User object if is imported by a database or a JWT if isn't
     *
     * @return {object} session that will be returned to the client
     */
    session: (session, token) => {
      session = { ...session, ...token }
      return Promise.resolve(session)
    },
  },
}

export default (req, res) => NextAuth(req, res, options)