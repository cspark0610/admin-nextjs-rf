import { useState, useEffect, useContext } from 'react'
import { FamilyContext } from 'context/FamilyContext'
import DocumentService from 'services/Documents'

const formatName = (persons) => {
  if(!persons){
    return []
  }
  return persons.map(person => {
    return(
      {
        name: `${person.firstName} ${person.lastName}`,
        id: person._id
      }
    )
  })
}

export default function useMembers(initialValue) {
  const { family } = useContext(FamilyContext)
  const [members, setMembers] = useState(initialValue)
  useEffect(() => {
    (async () => {
      const { hosts, familyMembers, tenants, externalStudents}= await DocumentService.getOwners(family._id)
      const formatedMembers = await {
        hosts: formatName(hosts) || [],
        familyMembers: formatName(familyMembers) || [],
        tenants: formatName(tenants) || [],
        externalStudents: formatName(externalStudents) || []
      }
      await setMembers(formatedMembers)
    })()
    return () => { }
  }, [])
  return members
}