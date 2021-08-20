import React from 'react'
import classes from 'styles/UI/Atoms/FileUploader.module.scss'

interface Props {
    placeholder: string,
    id: string,
    name: string
    style?: React.CSSProperties,
    onChange: (e: any) => void
}
const FileUploader : React.FC<Props> = ({ placeholder, id, name, onChange, style}) => {
    return (
        <label style={style} htmlFor={id} className={`${classes.container} p-button`}>
            <span>{placeholder}</span>
            <input
                className={classes.input}
                type="file"
                id={id}
                name={name}
                onChange={e=> onChange(e)}
            />
        </label>
    )
}
export default FileUploader