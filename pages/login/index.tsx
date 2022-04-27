// main tools
import { getSession } from 'next-auth/react'
import { useState } from 'react'

// components
import { LoginForm } from 'components/Login'

// prime components
import { Button } from 'primereact/button'

// styles
import classes from 'styles/Login/page.module.scss'

// types
import { GetServerSidePropsContext, NextPage } from 'next'

const LoginPage: NextPage = () => {
  const [showLoginForm, setShowLoginForm] = useState(false)

  return (
    <div className={classes.container}>
      {showLoginForm ? (
        <LoginForm />
      ) : (
        <>
          <img
            alt='logo redleaf'
            className={classes.logo}
            src='/assets/logo-redleaf.svg'
          />
          <Button
            className={classes.button}
            onClick={() => setShowLoginForm(true)}
          >
            Login
          </Button>
        </>
      )}
    </div>
  )
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getSession(ctx)
  if (session)
    return { redirect: { destination: '/', permanent: false }, props: {} }
  return { props: {} }
}

export default LoginPage
