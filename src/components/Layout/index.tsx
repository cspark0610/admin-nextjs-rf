import React from 'react'
// components
import Navigation from 'components/Navigation'
//styles
import style from 'styles/Layout/mainLayout.module.scss'

export default function Layout({children, noPadding}) {
    
    const paddingStyle = noPadding ? {padding:'0'} : {}
    return (
        <section>
            <Navigation/>
            <main className={style.main} style={paddingStyle}>
               {children} 
            </main>
        </section>
    )
}
