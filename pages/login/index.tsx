import { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import classes from 'styles/Home/Home.module.scss'
import LoginForm from 'components/Login'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { Toast } from 'primereact/toast'


export default function FamilyPage() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [session, loading] = useSession()
  const { push } = useRouter()
  const {reason} = useRouter().query
  const toast = useRef(null)
  const showError = () => {
    toast.current.show({
      severity: 'error',
      summary: 'Error Message',
      detail: 'Your session has expired',
      life: 3000,
    })
  }
  useEffect(() => {
    if(reason === 'expiredSession') showError()
    
  }, [!!reason])

  useEffect(() => {
    if (!loading && session) {
      push('/')
    }
  }, [session, loading])
  console.log(reason)

  return (
    <div className={classes.home}>
      {!showLoginForm && (
        <>
          <img src='/assets/logo-redleaf.svg' alt='logo redleaf' />
          <Button
            onClick={() => setShowLoginForm(true)}
            className='p-button-lg'
          >
            Login
          </Button>
        </>
      )}
      {showLoginForm && <LoginForm />}
      <Toast ref={toast} />
    </div>
  )
}
