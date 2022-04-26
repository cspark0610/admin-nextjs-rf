// main tools
import { useEffect, useState, useRef } from 'react'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// prime components
import { ScrollTop } from 'primereact/scrolltop'
import { BlockUI } from 'primereact/blockui'
import { Toast } from 'primereact/toast'

// bootstrap components
import { SSRProvider, Spinner } from 'react-bootstrap'

// axios
import 'lib/InitializeAxiosConfig'

// styles
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'styles/globals.scss'

// types
import type { AppProps } from 'next/app'
import type { FC } from 'react'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  const [loadingPage, setLoadingPage] = useState(false)
  const toast = useRef(null)
  const router = useRouter()

  /**
   * Navbar animation controller on scroll and Page transition loader
   */
  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoadingPage(true))
    router.events.on('routeChangeComplete', () => setLoadingPage(false))

    return () => {
      router.events.off('routeChangeComplete', () => setLoadingPage(false))
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Redleaf | Admin</title>
      </Head>

      <SessionProvider session={pageProps.session}>
        <SSRProvider>
          <Component {...pageProps} />
          <BlockUI
            fullScreen
            blocked={loadingPage}
            template={<Spinner animation='grow' />}
          />
          <Toast ref={toast} />
          <ScrollTop />
        </SSRProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp
