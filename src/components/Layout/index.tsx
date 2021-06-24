import React from 'react'
// components
import Navigation from 'components/Navigation'
//styles
import style from 'styles/Layout/mainLayout.module.scss'
type propTypes = {
    children : JSX.Element[] | JSX.Element,
    noPadding?:any 
}

interface LayoutInterface {
    (props : propTypes): JSX.Element
}
const Layout : LayoutInterface = ({ children, noPadding }) => {
    const paddingStyle = noPadding ? { padding: '0' } : {}
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
    
