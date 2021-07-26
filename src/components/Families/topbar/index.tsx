import React, { useState, useContext } from 'react'
//components
import { Dropdown } from 'primereact/dropdown';
import Icon from 'components/UI/Atoms/Icon'
//styles
import classes from 'styles/Families/Topbar.module.scss'
//Api
import FamiliesService from 'services/Families'
//Context
import { FamilyContext } from 'context/FamilyContext'

export const Topbar: React.FC = () => {
    const { family, setFamily } = useContext(FamilyContext)

    const [status, setStatus] = useState(family.familyInternalData.status)
    const [statusLoading, setStatusLoading] = useState(false)

    const [type, setType] = useState(family.familyInternalData.type)
    const [typeLoading, setTypeLoading] = useState(false)

    const [score, setScore] = useState(family.familyScore)
    const [scoreLoading, setScoreLoading] = useState(false)

    //dropdowns options
    const scoreSelectItems = ['Gold', "Silver", "Bronze"]
    const statusSelectItems = ["Potential", "Active", "Inactive", "Rejected", "Low"]
    const typeSelectItems = ["Mono Parental without Children", "Mono Parental with Children", "Couple with Children", "Couple without Children"]

    //onChange
    const onScoreChange = async (e: { value: any }) => {
        setScoreLoading(true)
        try {
            await FamiliesService.updatefamily(family.id, { familyScore: e.value })
            setFamily({ ...family, familyScore: e.value })
            setScoreLoading(false)
        } catch (err) {
            console.log(err)
            setScoreLoading(false)
        }
        setScore(e.value);
    }
    const onTypeChange = async (e: { value: any }) => {
        setTypeLoading(true)
        try {
            await FamiliesService.updatefamily(family.id, { familyInternalData: { ...family.familyInternalData, type: e.value } })
            setFamily({ ...family, familyInternalData: { ...family.familyInternalData, type: e.value } })
            setTypeLoading(false)
        } catch (err) {
            console.log(err)
            setTypeLoading(false)
        }
        setType(e.value);
    }
    const onStatusChange = async (e: { value: any }) => {
        setStatusLoading(true)
        try {
            await FamiliesService.updatefamily(family.id, { familyInternalData: { ...family.familyInternalData, status: e.value } })
            setFamily({ ...family, familyInternalData: { ...family.familyInternalData, status: e.value} })
            setStatusLoading(false)
        } catch (err) {
            setStatusLoading(false)
            console.log(err)
        }
        setStatus(e.value);
    }

    const selectedScoreTemplate = (option: string, props: { placeholder: string }) => {
        if (option) {
            return (
                <div className={classes.dropdown}>
                    <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon} />
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
                <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon} />
                <div>{option}</div>
            </div>
        );
    }
    console.log(family)
    return (
        <header className={classes.topbar}>
            <section>
                <div>
                    <label>Family:</label><strong>{family.name}</strong>
                </div>
                <div>
                    <label>Status: {statusLoading && <i className="pi pi-spin pi-spinner" />}</label>
                    <Dropdown options={statusSelectItems} placeholder="Status" value={status} onChange={onStatusChange} />
                </div>
                <div>
                    <label>Kind of family: {typeLoading && <i className="pi pi-spin pi-spinner" />}</label> 
                    <Dropdown options={typeSelectItems} placeholder="Kind of family" value={type} onChange={onTypeChange} />
                </div>
                <div>
                    <label>Category: {scoreLoading && <i className="pi pi-spin pi-spinner" />}</label>
                    <Dropdown options={scoreSelectItems} placeholder="Score" value={score} onChange={onScoreChange} valueTemplate={selectedScoreTemplate} itemTemplate={scoreOptionTemplate} />
                </div>
            </section>
        </header>
    )
}
