// main tools
import { useEffect, useRef } from 'react'
import { Provider } from 'next-auth/client'
import { useRouter } from 'next/router'
import Head from 'next/head'

// prime components
import { Toast } from 'primereact/toast'

// context
import { FamilyProvider } from 'context/FamilyContext'
import { RegisterFamilyProvider } from 'context/RegisterFamilyContext'

// styles
import 'styles/globals.scss'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

// types
import type { FC } from 'react'
import type { AppProps } from 'next/app'
import type { ErrorMessages } from 'types'

const ERROR_RESPONSES: ErrorMessages = {
  CredentialsSignin: 'Invalid Credentials',
}

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const toast = useRef(null)
  const { query } = useRouter()
  const sessionOptions = { clientMaxAge: 10 } // Re-fetch session if cache is older than 30 minutes

  useEffect(() => {
    query.error &&
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: ERROR_RESPONSES[query.error as string],
        life: 4000,
      })
  }, [query])

  return (
    <>
      <Head>
        <title>Redleaf | Admin</title>
      </Head>

      <Provider options={sessionOptions} session={pageProps.session}>
        <FamilyProvider>
          <RegisterFamilyProvider>
            <Component {...pageProps} />
          </RegisterFamilyProvider>
        </FamilyProvider>
        <Toast ref={toast} />
      </Provider>
    </>
  )
}

export default MyApp
