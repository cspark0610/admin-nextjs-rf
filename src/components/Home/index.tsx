import React, {useContext, useEffect} from 'react'
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from 'next-auth/client';
//styles
import classes from 'styles/Home/Home.module.scss'
export default function HomeComponent() {
    const [session] = useSession()
    const {activeUserType, getUser } = useContext(FamilyContext)
    useEffect(() => {
        getUser()
    }, [session])
    return (
        <div className={classes.home}>
            <img src="/assets/logo-redleaf.svg" alt="logo redleaf" />
        </div>
    )
}
