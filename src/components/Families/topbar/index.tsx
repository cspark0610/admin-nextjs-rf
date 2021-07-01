import React,{useState, useContext} from 'react'
//components
import { Dropdown } from 'primereact/dropdown';
import Icon from 'components/UI/Atoms/Icon'
//styles
import classes from 'styles/Families/Topbar.module.scss'
//Api
import FamiliesService from 'services/Families'
//Context
import {FamilyContext} from 'context/FamilyContext'

export const Topbar:React.FC = () => {
    const {family, setFamily} = useContext(FamilyContext)
    
    const [status, setStatus] = useState(family.familyInternalData.status)
    const [type, setType] = useState(family.familyInternalData.type)
    const [score, setScore] = useState(family.familyScore)
    

    const familyService = new FamiliesService()

    //dropdowns options
    const scoreSelectItems =['Gold', "Silver", "Bronze"]
    const statusSelectItems = ["Potential", "Active", "Inactive", "Rejected", "Low"]
    const typeSelectItems = ["Mono Parental without Children", "Mono Parental with Children", "Couple with Children", "Copule without Children"]
    
    //onChange
    const onScoreChange = async (e: { value: any}) => {
        try {
           await familyService.updatefamily(family.id, {familyScore: e.value})
           setFamily({...family, familyScore: e.value})
        } catch (err) {
            console.log(err)
        }
        setScore(e.value);
    }
    const onTypeChange = async (e: { value: any}) => {
        try {
           await familyService.updatefamily(family.id, {familyInternalData : {type: e.value}})
           setFamily({...family, familyInternalData : {type: e.value}})
        } catch (err) {
            console.log(err)
        }
        setType(e.value);
    }
    const onStatusChange = async (e: { value: any}) => {
        try {
            await familyService.updatefamily(family.id, {familyInternalData : {status: e.value}})
            setFamily({...family, familyInternalData : {status: e.value}})
         } catch (err) {
             console.log(err)
         }
         setType(e.value);
        setStatus(e.value);
    }
    
    const selectedScoreTemplate = (option: string, props: { placeholder: string }) => {
        if (option) {
            return (
                <div className={classes.dropdown}>
                    <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon}/>
                    <div>{option}</div>
                </div>
            );
        }
        return (
            <div className={classes.dropdown}>
                {props.placeholder}
            </div>
        );
    }
    const scoreOptionTemplate = option => {
        return (
            <div className={classes.dropdown}>
                <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon}/>
                <div>{option}</div>
            </div>
        );
    }
    return (
        <header className={classes.topbar}>
            <section>
                <div><label>Family:</label><strong>{family.name}</strong></div>
                <div><label>Status:</label> <Dropdown options={statusSelectItems} placeholder="Status" value={status} onChange={onStatusChange} /></div>
                <div><label>Kind of family:</label> <Dropdown options={typeSelectItems} placeholder="Kind of family" value={type} onChange={onTypeChange}/></div>
                <div><label>Category: </label><Dropdown options={scoreSelectItems} placeholder="Score" value={score} onChange={onScoreChange} valueTemplate={selectedScoreTemplate} itemTemplate={scoreOptionTemplate}/></div>
            </section>
        </header>
    )
}
