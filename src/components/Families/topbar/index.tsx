import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
//components
import { Dropdown } from 'primereact/dropdown'
import Icon from 'components/UI/Atoms/Icon'
//styles
import classes from 'styles/Families/Topbar.module.scss'
//Api
import FamiliesService from 'services/Families'
//required for localmanager dropdown
//import GenericsService from 'services/Generics'

//Context
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from 'next-auth/client'

import { confirmDialog } from 'primereact/confirmdialog'
import { Button } from 'primereact/button'

export const Topbar: React.FC = () => {
  const { family, getFamily } = useContext(FamilyContext)

  const [status, setStatus] = useState(family.familyInternalData?.status)
  const [statusLoading, setStatusLoading] = useState(false)

  const [type, setType] = useState(family.familyInternalData?.type)
  const [typeLoading, setTypeLoading] = useState(false)

  const [score, setScore] = useState(family.familyScore)
  const [scoreLoading, setScoreLoading] = useState(false)
  //required for localmanager dropdown
  //const [localManagerInput, setLocalManagerInput] = useState([])
  const [localCoordinator, setLocalCoordinator] = useState(
    family.familyInternalData.localManager || {}
  )
  const [session] = useSession()

  useEffect(() => {
    setLocalCoordinator(family.familyInternalData.localManager)
  }, [family?.familyInternalData?.localManager])
  
  //dropdowns options
  const scoreSelectItems = ['Gold', 'Silver', 'Bronze']
  const statusSelectItems = ["Potential", "Pending", "Active", "Inactive", "Removed", "Rejected"].sort()
  const typeSelectItems = [
    'Couple with Children',
    'Couple without Children ',
    'Mono',
    'Single',
  ].sort()

  //onChange
  const onScoreChange = async (e: { value: any }) => {
    setScoreLoading(true)
    try {
      await FamiliesService.updatefamily(session?.token, family._id, {
        familyScore: e.value,
      })
      getFamily()
      setScoreLoading(false)
    } catch (err) {
      console.error(err)
      setScoreLoading(false)
    }
    setScore(e.value)
  }
  const onTypeChange = async (e: { value: any }) => {
    setTypeLoading(true)
    try {
      await FamiliesService.updatefamily(session?.token, family._id, {
        familyInternalData: { ...family.familyInternalData, type: e.value },
      })
      getFamily()
      setTypeLoading(false)
    } catch (err) {
      console.error(err)
      setTypeLoading(false)
    }
    setType(e.value)
  }
  const onStatusChange = async (e: { value: any }) => {
    setStatusLoading(true)
    try {
      confirmDialog({
        message: `Are you sure you want to change the status of this family?`,
        header: 'Confirm Status Change',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          await FamiliesService.updatefamily(session?.token, family._id, {
            familyInternalData: {
              ...family.familyInternalData,
              status: e.value,
            },
          })
          getFamily()
          setStatusLoading(false)
        },
        reject: () => {},
      })
    } catch (err) {
      setStatusLoading(false)
      console.error(err)
    }
    setStatus(e.value)
  }

  const selectedScoreTemplate = (
    option: string,
    props: { placeholder: string }
  ) => {
    if (option) {
      return (
        <div className={classes.dropdown}>
          <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon} />
          <div>{option}</div>
        </div>
      )
    }
    return <div className={classes.dropdown}>{props.placeholder}</div>
  }
  const scoreOptionTemplate = (option) => {
    return (
      <div className={classes.dropdown}>
        <Icon svg={`${option.toLowerCase()}-medal`} classes={classes.icon} />
        <div>{option}</div>
      </div>
    )
  }
  const router = useRouter()
  const handleBack = ()=>{
    //save back on localstorage
    localStorage.setItem('isBack', JSON.stringify({isBack:true}))
    //and go back with router
    router.back()
  }

  return (
    <header className={classes.topbar}>
      <div>
          <Button
          onClick={handleBack}
          icon="pi pi-chevron-left" 
          className="p-button-link p-button-success" 
          style={{minWidth:'200px', borderRadius:'2rem', padding:'4px', justifyContent:'flex-start'}}
          >
            <span style={{marginLeft:'12px'}}>
            Back to search
            </span>
            </Button>
        </div>
      <section style={{display: 'flex', flexWrap:'nowrap', alignItems:'flex-start', marginTop:'24px'}}>
        <div style={{marginRight: '20px', maxWidth:'240px'}}>
          <label>Family:</label>
          <strong>{family.name}</strong>
        </div>
        
        <div style={{marginRight: '20px'}}>
          <label>
            Local coordinator: 
          </label>
          <strong>{localCoordinator?.name || 'Not assigned'}</strong>
          
          
        </div>
        <div style={{marginRight: '20px'}}>
          <label>
            Status: {statusLoading && <i className='pi pi-spin pi-spinner' />}
          </label>
          <Dropdown
            options={statusSelectItems}
            placeholder='Status'
            value={status}
            onChange={onStatusChange}
          />
        </div>
        <div style={{marginRight: '20px'}}>
          <label>
            Kind of family:{' '}
            {typeLoading && <i className='pi pi-spin pi-spinner' />}
          </label>
          <Dropdown
            options={typeSelectItems}
            placeholder='Kind of family'
            value={type}
            onChange={onTypeChange}
          />
        </div>
        <div style={{marginRight: '20px'}}>
          <label>
            Category: {scoreLoading && <i className='pi pi-spin pi-spinner' />}
          </label>
          <Dropdown
            options={scoreSelectItems}
            placeholder='Score'
            value={score}
            onChange={onScoreChange}
            valueTemplate={selectedScoreTemplate}
            itemTemplate={scoreOptionTemplate}
          />
        </div>
      </section>
    </header>
  )
}
