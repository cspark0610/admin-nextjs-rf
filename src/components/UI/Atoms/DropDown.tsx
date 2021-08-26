import React, {useEffect, useState} from 'react'
import { Dropdown } from 'primereact/dropdown'

export default function DropDown({options, handleChange, optionLabel='name', placeholder, className, id}) {
    const [selected, setSelected] = useState({name:'initialState'})
    
    useEffect(() => {
        handleChange(id, selected.name)
    }, [selected])

    const onSelectItem = (e)=>{
            setSelected({name: e.value.name})
    }
    return (
        <Dropdown className={className} id={id} value={selected} options={options} onChange={onSelectItem} optionLabel={optionLabel} placeholder={placeholder} />
    )
}
