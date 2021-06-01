// types
import type { AppProps } from 'next/app'
import type { FC } from 'react'

// styles
import 'styles/globals.scss'

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
)

export default MyApp
