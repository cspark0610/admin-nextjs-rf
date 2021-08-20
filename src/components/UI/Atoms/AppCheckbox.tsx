import React from 'react'
import {Checkbox} from 'primereact/checkbox'

export default function AppCheckbox({htmlId, checkedLabel, uncheckedLabel, value, setValue}) {
    return (
        <div style={{marginTop: '1em'}}>
             <Checkbox inputId={htmlId} checked={value} onChange={e => setValue(e.checked)}/>
             <label htmlFor={htmlId} style={{marginInline: '1em'}}>{value ? checkedLabel : uncheckedLabel}</label>
        </div>
    )
}
