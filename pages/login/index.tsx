import { useState } from 'react'
import { Button } from 'primereact/button'
import classes from 'styles/Home/Home.module.scss'
import LoginForm from 'components/Login'

export default function FamilyPage() {
    const [showLoginForm, setShowLoginForm] = useState(false)
    
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
