// main tools
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'
import Axios from 'axios'
// import dayjs from 'dayjs'

// services
import { AuthService } from 'services/Auth'
import { BaseService } from 'services/base'

export default NextAuth({
  pages: { error: '/login' }, // custom error page with query string as ?error=
  session: { maxAge: 24 * 60 * 60 }, // initial value in seconds, logout on a day of inactivity

  providers: [
    CredentialsProvider({
      id: 'Credentials',
      name: 'Credentials',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },

      /**
       * verify if the user is found in the backend
       */
      authorize: async (credentials) => {
        if (credentials) {
          const { email, password } = credentials
          const { data, response } = await AuthService.login({
            email,
            password,
          })
          if (data) return data
          else
            throw new Error(
              `Base url ${Axios.defaults.baseURL} ${response.data.message}`
            )
        }
      },
    }),
  ],

  callbacks: {
    /**
     * jwt that will be sent to session callback
     */
    jwt: async ({ token, user }) => {
      if (user)
        token = {
          ...user,
          //  user: { ...user.user, userType: user.user.type }
        }
      // else if (dayjs(token.tokenExpiresIn).diff(dayjs(), 'minutes') < 5) {
      //   const refresh = await AuthService.refreshToken({
      //     refresh_token: token.refreshToken,
      //   })
      //   token = { ...token, ...refresh }
      // }

      return Promise.resolve(token)
    },

    /**
     * handle session that will be returned to the client
     */
    session: async ({ session, token }) => {
      session = { ...session, ...token }
      return Promise.resolve(session)
    },
  },
})
