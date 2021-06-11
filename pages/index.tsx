// main tools
import Head from 'next/head'
import Image from 'next/image'
import type { FC } from 'react'

// components
import Layout from 'components/Layout'

const Home: FC = () => (
  <>
    <Head>
      <title>Redleaf admin</title>
      <meta name='admin for redleaf' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Layout>
      <h1>home</h1>
    </Layout>
  </>
)

export default Home
