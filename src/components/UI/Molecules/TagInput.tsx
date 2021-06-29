import React, { useState } from 'react'
//components
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import Tag from 'components/UI/Atoms/Tag'
//styles
import classes from "styles/UI/Molecules/TagInput.module.scss"
export default function TagInput({ placeholder, value, setValue }) {
    const [tag, setTag] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        setValue(value.concat(tag))
        setTag('')
    }
    const handleDelete = index => {
        console.log("its working", index)
        const newArray = value.filter(item => {
            return item !== value[index]
        })
        setValue(newArray)
    }
    return (
        <div>
            <form onSubmit={e => handleSubmit(e)} className={classes.tag_input}>
                <InputText name='tags' value={tag} placeholder={placeholder} onChange={e => setTag(e.target.value)} />
                <Button label="Add" />
            </form>
            <div className={classes.tag_container}>
                {value.map((tag, index) => <Tag label={tag} key={index} color={`hsl(${(Math.floor(Math.random() * 36)*10)}, 60%, 84%)`} callback={() => handleDelete(index)}/>)}
            </div>
        </div>
    )
}
