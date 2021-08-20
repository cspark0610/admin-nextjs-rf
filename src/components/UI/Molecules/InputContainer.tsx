import React from 'react'
//styles
import classes from 'styles/UI/Molecules/InputContainer.module.scss'

interface Props {
    children: any,
    label: string,
    labelClass?: string
    style?: React.CSSProperties
}
const InputContainer : React.FC<Props> = ({children,label, labelClass, style}) => {
    return (
        <div className={classes.container} style={style}>
            <label className={labelClass || ''}>{label}</label>
            {children}
        </div>
    )
}

export default InputContainer