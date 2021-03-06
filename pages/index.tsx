// main tools
import { getSession } from 'next-auth/react'
import Image from 'next/image'

// components
import { Layout } from 'components/Layout'

//styles
import classes from 'styles/Home/Home.module.scss'

// types
import { GetServerSidePropsContext, NextPage } from 'next'

const HomePage: NextPage = () => (
  <Layout noPadding>
    <div className={classes.home}>
      <Image
        priority
        width={500}
        height={500}
        alt='logo redleaf'
        className={classes.img}
        src='/assets/logo-redleaf.svg'
      />
    </div>
  </Layout>
)

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  if (!session)
    return { redirect: { destination: '/login', permanent: false }, props: {} }

  return { props: {} }
}

export default HomePage
