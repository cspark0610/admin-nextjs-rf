import React from 'react'
//styles
import classes from 'styles/UI/Molecules/InputContainer.module.scss'
export default function InputContainer({children,label}) {
    return (
        <div className={classes.container}>
            <label>{label}</label>
            {children}
        </div>
    )
}
