// main tools
import { getSession } from 'next-auth/react'
import type { FC } from 'react'

// components
import { Layout } from 'components/Layout'

//styles
import classes from 'styles/Home/Home.module.scss'

// types
import { GetServerSidePropsContext } from 'next'

const Home: FC = () => (
  <Layout noPadding>
    <div className={classes.home}>
      <img src='/assets/logo-redleaf.svg' alt='logo redleaf' />
    </div>
  </Layout>
)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  if (!session)
    return { redirect: { destination: '/login', permanent: false }, props: {} }

  return { props: {} }
}

export default Home
