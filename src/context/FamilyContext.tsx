import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useCallback, useState, createContext, Context } from 'react'

import FamiliesService from 'services/Families'

type FamilyContextType = {
  family: any,
  getFamily: any
}

export const FamilyContext: Context<Partial<FamilyContextType>> = createContext<Partial<FamilyContextType>>({})

export const FamilyProvider = props => {
  const [family, setFamily] = useState(null)
  const [session] = useSession()
  const router = useRouter()

  const getFamily = useCallback(async () => {
    console.log('aqui')
    const data = await FamiliesService.getFamily(session?.token, router.query.id)
    console.log('data',data)
    setFamily(data)
  }, [setFamily, session, router.query])
  
  return (
    <FamilyContext.Provider
      value={{
        family,
        getFamily
      }}
    >
      { props.children }
    </FamilyContext.Provider>
  )
}