// main tools
import CredentialsProvider from 'next-auth/providers/credentials'
import AuthService from 'services/Auth'
import NextAuth from 'next-auth'
// import dayjs from 'dayjs'

export default NextAuth({
  pages: { error: '/login' }, // custom error page with query string as ?error=
  session: { maxAge: 60 * 60 }, // initial value in seconds, logout on a day of inactivity

  providers: [
    CredentialsProvider({
      id: 'Credentials',
      name: 'Credentials',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },

      /**
       * verify if the user is found in the backend
       *
       * @param credentials
       * @returns
       */
      authorize: async (credentials) => {
        if (credentials) {
          const { email, password } = credentials
          const res = await AuthService.login({
            email,
            password,
          })
          if (res?.data) return res?.data
          else
            throw new Error(
              res?.response.data.message || res?.response.data.error
            )
        }
      },
    }),
  ],

  callbacks: {
    /**
     * @param token decrypted jwt
     * @param user user received afther authorize method
     *
     * @return jwt that will be send to session callback
     */
    jwt: async ({ token, user }) => {
      if (user)
        token = { ...user, user: { ...user.user, userType: user.user.type } }
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
    session: ({ session, token }) => {
      session = { ...session, ...token }
      return Promise.resolve(session)
    },
  },
})
