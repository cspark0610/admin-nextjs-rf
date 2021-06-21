// types
import type { AppProps } from 'next/app'
import type { FC } from 'react'

// styles
import 'styles/globals.scss'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
)

export default MyApp
