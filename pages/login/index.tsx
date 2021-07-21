import { useState } from 'react'
import { Button } from 'primereact/button'
import classes from 'styles/Home/Home.module.scss'
import LoginForm from 'components/Login'

export default function FamilyPage() {
    const [showLoginForm, setShowLoginForm] = useState(false)
    
    return (
        <div className={classes.home}>
            <img src="/assets/logo-redleaf.svg" alt="logo redleaf" />
            {
                !showLoginForm && (
                    <Button
                        onClick={() => setShowLoginForm(true)}
                    >
                        Login
                    </Button>
                )
            }
            {
                showLoginForm && <LoginForm />
            }
        </div>
    )
}
