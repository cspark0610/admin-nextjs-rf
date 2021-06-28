// main tools
import Head from 'next/head'
import Image from 'next/image'
import type { FC } from 'react'

// components
import Layout from 'components/Layout'
import HomeComponent from 'components/Home'

const Home: FC = () => (
  <>
    <Head>
      <title>Redleaf admin pmvs</title>
      <meta name='admin for redleaf' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
    <Layout noPadding>
      <HomeComponent/>
    </Layout>
  </>
)

export default Home
