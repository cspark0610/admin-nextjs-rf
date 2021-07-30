import React, { useState, useContext, useRef } from 'react'
//components
import MainMemberForm from 'components/UI/Organism/MainMemberForm'
import FormHeader from 'components/UI/Molecules/FormHeader'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'
//Api
import FamiliesService from 'services/Families'
//Context
import {FamilyContext} from 'context/FamilyContext'
import { useSession } from 'next-auth/client';

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
    const [mainMembers, setMainMembers] = useState<MainMember[]>(family.mainMembers)
    const [loading, setLoading] = useState(false)
    const toast = useRef(null)
    const [session, ] = useSession()

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

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success Message', detail:'Host data successfully updateds', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error Message', detail:'An error has ocurred', life: 3000});
    }

    const addMember = () => {
        setMainMembers([...mainMembers, newMember])
    }
    const updateMember = (updatedMember, id) => {
        console.log(updatedMember)
        const updatedMemberList = [...mainMembers]
        updatedMemberList[id] = {...updatedMemberList[id],[updatedMember.target.name]: updatedMember.target.value}
        setMainMembers(updatedMemberList)
        console.log('update member', updatedMemberList)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setFamily({...family, mainMembers})
        FamiliesService.updatefamily(session?.token, family._id, {mainMembers})
        .then(()=>{
            setLoading(false)
            showSuccess()
        })
        .catch(err=>{
            setLoading(false)
            showError()
            console.log(err)
        })
        console.log(family.mainMembers)
    }
    return (
        <>
        <form onSubmit={(e)=> handleSubmit(e)}>
            <FormHeader title="Contact" isLoading={loading}/>
            {mainMembers.map((mainMember, index)=> {
                return(
                <MainMemberForm key={index} id={index} member={mainMember} submit={updateMember} family={family}/>
                )
            })}
            {mainMembers.length === 1 && <Button icon="pi pi-user-plus" label="Add Main family member" className="p-button-rounded" onClick={() => addMember()}/>}
        </form>
        <Toast ref={toast} />
        </>
    )
}
