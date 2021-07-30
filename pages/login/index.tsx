import { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import classes from 'styles/Home/Home.module.scss'
import LoginForm from 'components/Login'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

export default function FamilyPage() {
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [session, loading] = useSession()
    const { push } = useRouter()

    useEffect(() => {
        if (!loading && !session) {
            push('/login')
        } else if(!loading && session) {
            push('/')
        }
    }, [session, loading])

    return (
        <div className={classes.home}>
            {
                !showLoginForm && (
                    <>
                        <img src="/assets/logo-redleaf.svg" alt="logo redleaf" />
                        <Button
                            onClick={() => setShowLoginForm(true)}
                            className="p-button-lg"
                        >
                            Login
                        </Button>
                    </>
                )
            }
            {
                showLoginForm && <LoginForm />
            }
        </div>
    )
}
