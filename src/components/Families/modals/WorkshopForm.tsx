import React, { useEffect, useState } from 'react'
import InputContainer from 'components/UI/Molecules/InputContainer'
import { Button } from 'primereact/button'
import { useFormik } from 'formik'
import { classNames } from 'primereact/utils'
//utils
import GenericsService from 'services/Generics';
import { useSession } from 'next-auth/client';
import { Dropdown } from 'primereact/dropdown';
type workshopData = {
    workshops: any
}
interface Props {
    data?: any
    onSubmit: (e:any) => void
}


const WorkshopForm : React.FC<Props>= ({data, onSubmit}) => {
    const [workshops, setWorkshops] = useState([])
    const [session] = useSession()

    console.log('JEHJBJKSVJD', {
        workshops: data || {},
    })

    const formik = useFormik({
        initialValues:{
            workshops: data || {},
        },
        validate: (data) => {
            let errors: Partial<workshopData> = {}

            if(data.workshops === ''){
                errors.workshops = 'Workshop is required'
            }

            return errors
        },
        onSubmit: (data) => {
            onSubmit(workshops.find(item => item._id === data.workshops._id))
            formik.resetForm()
        }
    })

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    useEffect(() => {
        GenericsService.getGeneric(session?.token, 'workshop')
            .then(response => {
                setWorkshops(response.sort((a, b) => {
                    if (a.name > b.name) return 1
                    if (a.name < b.name) return -1
                    return 0
                }))
            })
            .catch(error => console.error(error))
    }, [session])

    return (
        <form onSubmit={formik.handleSubmit}>
           <InputContainer label="Workshops" labelClass={classNames({ 'p-error': isFormFieldValid('workshops') })}>
                <Dropdown
                    value={formik.values.workshops}
                    options={workshops}
                    onChange={e => formik.setFieldValue('workshops', e.value)}
                    placeholder="Select Workshop"
                    optionLabel="name"
                    showClear
                />
                {getFormErrorMessage('workshops')}
            </InputContainer>
            <Button type="submit">Save</Button>
        </form>
    )
}
export default WorkshopForm