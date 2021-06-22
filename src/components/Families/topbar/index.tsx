import React,{useState} from 'react'
//components
import { Dropdown } from 'primereact/dropdown';

//styles
import classes from 'styles/Families/Topbar.module.scss'

interface Props {
    data: {
        name: string,
        familyScore: string,
        familyType: string,
        familyStatus:string
    }
}

export const Topbar:React.FC<Props> = ({data}) => {
    const [status, setStatus] = useState(data.familyStatus)
    const [type, setType] = useState(data.familyType)
    const [score, setScore] = useState(data.familyScore)
    //dropdowns options
    const scoreSelectItems =['Bronze', "Silver", "Gold"]
    const statusSelectItems = ["Potential", "Active", "Inactive", "Rejected", "Low"]
    const typeSelectItems = ["Mono Parental without Children", "Mono Parental with Children", "Couple with Children", "Copule without Children"]
    
    const onScoreChange = (e: { value: any}) => {
        setScore(e.value);
    }
    const onTypeChange = (e: { value: any}) => {
        setType(e.value);
    }
    const onStatusChange = (e: { value: any}) => {
        setStatus(e.value);
    }

    return (
        <header className={classes.topbar}>
            <section>
                <div><label>Name:</label><strong>{data.name}</strong></div>
                <div><label>Status:</label> <Dropdown options={statusSelectItems} placeholder="Status" value={status} onChange={onStatusChange}/></div>
                <div><label>Kind of family:</label> <Dropdown options={typeSelectItems} placeholder="Kind of family" value={type} onChange={onTypeChange}/></div>
                <div><label>Category: </label><Dropdown options={scoreSelectItems} placeholder="Score" value={score} onChange={onScoreChange}/></div>
            </section>
        </header>
    )
}
