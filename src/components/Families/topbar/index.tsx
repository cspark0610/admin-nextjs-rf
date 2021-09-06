import React, { useState, useContext } from 'react'
//components
import { Dropdown } from 'primereact/dropdown'
import Icon from 'components/UI/Atoms/Icon'
//styles
import classes from 'styles/Families/Topbar.module.scss'
//Api
import FamiliesService from 'services/Families'
//Context
import { FamilyContext } from 'context/FamilyContext'
import { useSession } from 'next-auth/client'

import { confirmDialog } from 'primereact/confirmdialog'

export const Topbar: React.FC = () => {
  const { family, getFamily } = useContext(FamilyContext)

  const [status, setStatus] = useState(family.familyInternalData.status)
  const [statusLoading, setStatusLoading] = useState(false)

  const [type, setType] = useState(family.familyInternalData.type)
  const [typeLoading, setTypeLoading] = useState(false)

  const [score, setScore] = useState(family.familyScore)
  const [scoreLoading, setScoreLoading] = useState(false)

  const [session] = useSession()

  //dropdowns options
  const scoreSelectItems = ['Gold', 'Silver', 'Bronze'].sort()
  const statusSelectItems = [
    'Potential',
    'Active',
    'Inactive',
    'Rejected',
    'Low',
  ].sort()
  const typeSelectItems = [
    'Couple with Children',
    'Couple without Children ',
    'Mono Parental with Children',
    'Mono Parental without Children',
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
      console.log(err)
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
      console.log(err)
      setTypeLoading(false)
    }
    setType(e.value)
  }
  const onStatusChange = async (e: { value: any }) => {
    setStatusLoading(true)
    console.log(session?.token)
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
      console.log(err)
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
  return (
    <header className={classes.topbar}>
      <section>
        <div>
          <label>Family:</label>
          <strong>{family.name}</strong>
        </div>
        <div>
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
        <div>
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
        <div>
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
