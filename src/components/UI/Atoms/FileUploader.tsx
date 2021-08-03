import React from 'react'
import classes from 'styles/UI/Atoms/FileUploader.module.scss'

export default function FileUploader({ placeholder, id, name, onChange }) {
    return (
        <label htmlFor={id} className={`${classes.container} p-button`}>
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
