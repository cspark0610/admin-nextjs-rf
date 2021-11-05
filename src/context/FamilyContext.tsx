import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useCallback, useState, createContext, Context } from 'react'
import UsersService from 'services/Users';
import FamiliesService from 'services/Families'

type FamilyContextType = {
  family: any
  getFamily: any
  resetFamily: any
  activeUserType: any
  getUser: any
  tabInfo: any
  checkTabChanges: any
  setTabChanges: any
}

export const FamilyContext: Context<Partial<FamilyContextType>> = createContext<
  Partial<FamilyContextType>
>({})

export const FamilyProvider = (props) => {
  const [family, setFamily] = useState(null)
  const [activeUserType, setActiveUserType] = useState('')
  const [tabInfo, setTabInfo] = useState({tabName:'', hasChanges:false, leaving: false})
  const [session] = useSession()
  const router = useRouter()

  const checkTabChanges = () => {
    if(tabInfo.hasChanges === true) {
        //activate save button fixed on bottom
        return true
    } else {
        //can continue
        return false
    }
}

const setTabChanges = (tabName:string, hasChanges:boolean, leaving:boolean=false) => { setTabInfo({tabName, hasChanges, leaving})}

  const getFamily = useCallback(async () => {
    const data = await FamiliesService.getFamily(
      session?.token,
      router.query.id
    )
    setFamily(data)
  }, [setFamily, session, router.query])

  const getUser = () => {
    console.log(session)
    if(session?.user) {
      UsersService.getUser(session?.token, session?.user)
        .then((response) => setActiveUserType(response.userType))
        .catch((error) => console.error(error))

    }
  }


  const resetFamily = () => {
    setFamily(null)
  }

  return (
    <FamilyContext.Provider
      value={{
        family,
        getFamily,
        resetFamily,
        activeUserType,
        getUser,
        tabInfo,
        checkTabChanges,
        setTabChanges
      }}
    >
      {props.children}
    </FamilyContext.Provider>
  )
}
