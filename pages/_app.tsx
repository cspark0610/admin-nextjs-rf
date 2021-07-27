// types
import type { AppProps } from 'next/app'
import type { FC } from 'react'
import { Provider } from 'next-auth/client'

// styles
import 'styles/globals.scss'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Provider session={pageProps.session}>
    <Component {...pageProps} />
  </Provider>
)

export default MyApp
