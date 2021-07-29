import React from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown} from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'
//hooks
import useGenerics from 'hooks/useGenerics'

export default function ReviewForm() {
    const [genericInputs, isLoadingGeneric] = useGenerics(['nationalities'])
    console.log(genericInputs)
    return (
        <form>
           <InputContainer label="Student name">
                <InputText
                    placeholder="Student name"
                /> 
           </InputContainer> 
           <InputContainer label="Nationality">
               <Dropdown
                    placeholder="Select nationality"

               />
           </InputContainer> 
           <InputContainer label="Date of birth">
                <Calendar 
                    placeholder='Date of birth'
                    showIcon
                />
           </InputContainer> 
           <InputContainer label="Comments">
                <InputTextarea 
                    placeholder="Put some comments..."
                    rows={5} 
                    cols={30}
                    autoResize 
                />
           </InputContainer> 
        </form>
    )
}
