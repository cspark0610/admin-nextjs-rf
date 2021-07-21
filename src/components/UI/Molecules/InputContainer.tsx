import React from 'react'
//styles
import classes from 'styles/UI/Molecules/InputContainer.module.scss'

interface Props {
    children: any,
    label: string,
    labelClass?: string
}
const InputContainer : React.FC<Props> = ({children,label, labelClass}) => {
    return (
        <div className={classes.container}>
            <label className={labelClass || ''}>{label}</label>
            {children}
        </div>
    )
}

export default InputContainer