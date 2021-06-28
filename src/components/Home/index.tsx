import React from 'react'
//styles
import classes from 'styles/Home/Home.module.scss'
export default function HomeComponent() {
    return (
        <div className={classes.home}>
            <img src="/assets/logo-redleaf.svg" alt="logo redleaf" />
        </div>
    )
}
