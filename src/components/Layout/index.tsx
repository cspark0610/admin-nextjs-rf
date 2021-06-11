import React from 'react'
// components
import Navigation from 'components/Navigation'
//styles
import style from 'styles/Layout/mainLayout.module.scss'

export default function Layout(props) {
    return (
        <section>
            <Navigation/>
            <main className={style.main}>
               {props.children} 
            </main>
        </section>
    )
}
