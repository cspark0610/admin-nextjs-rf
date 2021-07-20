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

interface Generic {
    createdAt: string,
    id: string,
    name: string,
    updatedAt: string
}

interface MainMember {
    firstName: string,
    lastName: string,
    gender: string,
    occupation: Generic,
    email?:string,
    cellPhoneNumber: string,
    homePhoneNumber?:string,
    workPhoneNumber?:string,
    isCellPhoneVerified: boolean,
    isHomePhoneVerified: boolean,
    isWorkPhoneVerified: boolean,
    birthDate:string,
    photo?: string
    mainLanguagesSpokenAtHome: Generic[],
    spokenLanguages: Generic[]
    relationshipWithPrimaryHost?: string | null 
}

export default function ContactForm() {
    const {family, setFamily} = useContext(FamilyContext)
    console.log(family)
    const [mainMembers, setMainMembers] = useState<MainMember[]>(family.mainMembers)
    const familyService = new FamiliesService()
    const [loading, setLoading] = useState(false)
    
    const newMember: MainMember = {
        firstName: '',
        lastName: '',
        gender: '',
        occupation: {
            createdAt: '',
            updatedAt:'',
            id:'',
            name: ''
        },
        cellPhoneNumber: '',
        homePhoneNumber: '',
        workPhoneNumber: '',
        isCellPhoneVerified: false,
        isHomePhoneVerified: false,
        isWorkPhoneVerified: false,
        birthDate: '',
        mainLanguagesSpokenAtHome: [],
        spokenLanguages:[],
        email: ''
    }

    const addMember = () => {
        setMainMembers([...mainMembers, newMember])
    }
    const updateMember = async (updatedMember, id) => {
        const updatedMemberList = [...mainMembers]
        updatedMemberList[id] = updatedMember
        await setMainMembers(updatedMemberList)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(mainMembers)
        setLoading(true)
        setFamily({...family, mainMembers})
        familyService.updatefamily(family.id, mainMembers)
        .then(()=>{
            setLoading(false)
            console.log('success')
        })
        .catch(err=>{
            setLoading(false)
            console.log(err)
        })
        console.log(family.mainMembers)
    }
    return (
        <form onSubmit={(e)=> handleSubmit(e)}>
            <FormHeader title="Contact" isLoading={loading}/>
            {mainMembers.map((mainMember, index)=> {
                return(
                <MainMemberForm key={index} id={index} member={mainMember} submit={updateMember}/>
                )
            })}
            {mainMembers.length === 1 && <Button icon="pi pi-user-plus" label="Add Main family member" className="p-button-rounded" onClick={() => addMember()}/>}
        </form>
    )
}
