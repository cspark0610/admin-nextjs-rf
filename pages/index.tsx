// main tools
import type { FC } from 'react'
import { getSession } from 'next-auth/client'

// components
import Layout from 'components/Layout'
import HomeComponent from 'components/Home'

// types
import { GetServerSideProps } from 'next'

const Home: FC = () => (
  <Layout noPadding>
    <HomeComponent />
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  if (!session) return { redirect: { destination: '/login', statusCode: 307 } }
  return { props: {} }
}

export default Home
