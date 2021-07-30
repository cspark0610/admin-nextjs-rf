import React from 'react'
// components
import Navigation from 'components/Navigation'
import { useRouter } from 'next/router'
//styles
import style from 'styles/Layout/mainLayout.module.scss'
import { useSession } from 'next-auth/client'
import { useEffect } from 'react'

type propTypes = {
    children : JSX.Element[] | JSX.Element,
    noPadding?:any 
}

interface LayoutInterface {
    (props : propTypes): JSX.Element
}
const Layout : LayoutInterface = ({ children, noPadding }) => {
    const paddingStyle = noPadding ? { padding: '0' } : {}
    const [session, loading] = useSession();
    const { push } = useRouter()

    useEffect(() => {
        if (!loading && !session) {
            push('/login')
        } else if(!loading && session) {
            push('/')
        }
    }, [session, loading])

    return (
        <section>
            <Navigation />
            <main className={style.main} style={paddingStyle}>
                {children}
            </main>
        </section>
    )
}
export default Layout
    
