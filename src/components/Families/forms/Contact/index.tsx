import React, { useState, useContext } from 'react'
//components
import MainMemberForm from 'components/UI/Organism/MainMemberForm'
import FormHeader from 'components/UI/Molecules/FormHeader'
import { Button } from 'primereact/button';
//styles
import classes from "styles/Families/Forms.module.scss";
//Api
import FamiliesService from 'services/Families'
//Context
import {FamilyContext} from 'context/FamilyContext'

interface MainMember {
    firstName: string,
    lastName: string,
    gender: string,
    occupation:string,
    mainPhone: string,
    birthDate:string,
    alternPhoneType?: string,
    alternPhoneNum?: string,
    photo?: string
}

export default function ContactForm() {
    const {family, setFamily} = useContext(FamilyContext)
    console.log(family)
    const initialMainMembers: [MainMember] = family.mainMembers.map(({firstName, lastName, gender, occupation, mainPhone, birthDate})=>{
        return(
            {
                firstName,
                lastName,
                gender,
                occupation: occupation.name,
                mainPhone,
                birthDate,
            }
        )
    })
    const [mainMembers, setMainMembers] = useState<MainMember[]>(initialMainMembers)
    const familyService = new FamiliesService()
    
    const newMember: MainMember = {
        firstName: '', lastName: '',gender: '',occupation: '',mainPhone: '',birthDate: ''
    }

    const addMember = () => {
        setMainMembers([...mainMembers, newMember])
    }
    const updateMember = (updatedMember, id) => {
        const updatedMemberList = [...mainMembers]
        updatedMemberList[id] = updatedMember
        setMainMembers(updatedMemberList)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setFamily({...family, mainMembers})
        console.log(e)
    }
    return (
        <form onSubmit={(e)=> handleSubmit(e)}>
            <FormHeader title="Contact"/>
            {mainMembers.map((mainMember, index)=> {
                return(
                <MainMemberForm key={index} id={index} member={mainMember} submit={updateMember}/>
                )
            })}
            {mainMembers.length === 1 && <Button icon="pi pi-user-plus" label="Add Main family member" className="p-button-rounded" onClick={() => addMember()}/>}
        </form>
    )
}
