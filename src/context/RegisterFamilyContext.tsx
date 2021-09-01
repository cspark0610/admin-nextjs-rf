import { useCallback, useState, createContext, Context, useContext } from 'react'

type User = {
  name: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string
}

type MainMember = {
  firstName: string,
  lastName: string,
  email: string,
  occupation: any,
  gender: any,
  birthDate: string,
  mainLanguagesSpokenAtHome: any,
  spokenLanguages: any,
  cellPhoneNumber: string,
  homePhoneNumber: string,
  workPhoneNumber: string,
  relationshipWithThePrimaryHost: any
}

type FamilyMember = {
  firstName: string,
  lastName: string,
  gender: any,
  familyRelationship: any,
  birthDate: string,
  spokenLanguages: any,
  situation: string
}

type Pet = {
  type: any,
  name: string,
  race: string,
  age: number,
  remarks: string,
  isHipoalergenic: boolean
}

type StudentRoom = {
  aditionalFeatures: any,
  availability: Date[],
  bathType: string,
  bathroomLocation: string,
  bedType: string,
  floor: string,
  type: string,
}

type Home = {
  country: any
  province: any
  city: any
  postalCode: string
  address: string
  homeType: any
  houseRooms: any
  services: any
  nearbyServices: any
  studentRooms: StudentRoom[]
}

type Family = {
  user: User
  mainMembers: MainMember[]
  familyMembers: FamilyMember[]
  interests: any
  culturalActivities: any
  rulesForStudents: any
  welcomeStudentGenders: any
  acceptableDiets: any
  pets: Pet[]
  home: Home
}

type FamilyContextType = {
  family: Family
  setUser: (data: Partial<User>) => void
  setMainMembers: (data: MainMember[]) => void
  setFamilyMembers: (data: FamilyMember[]) => void
  setFamily: (data: Partial<Family>) => void
  setPets: (data: Pet[]) => void
  setHome: (data: Partial<Home>) => void
  setStudentRooms: (data: StudentRoom[]) => void
}

export const RegisterFamilyContext: Context<Partial<FamilyContextType>> = createContext<Partial<FamilyContextType>>({})

export const RegisterFamilyProvider = props => {
  const [family, setFamily] = useState<Family>({
    user: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mainMembers: [],
    familyMembers: [],
    interests: [],
    culturalActivities: [],
    rulesForStudents: [],
    welcomeStudentGenders: [],
    acceptableDiets: [],
    pets: [],
    home: {
      country: '',
      province: '',
      city: '',
      postalCode: '',
      address: '',
      homeType: '',
      houseRooms: [],
      services: [],
      nearbyServices: [],
      studentRooms: [],
    }
  })

  const handleSetFamily = useCallback(data => setFamily({ ...family, ...data }), [family])
  const setUser = useCallback(data => setFamily({ ...family, user: { ...family.user, ...data } }), [family])
  const setMainMembers = useCallback(data => setFamily({ ...family, mainMembers: data }), [family])
  const setFamilyMembers = useCallback(data => setFamily({ ...family, familyMembers: data }), [family])
  const setPets = useCallback(data => setFamily({ ...family, pets: data }), [family])
  const setHome = useCallback(data => setFamily({ ...family, home: { ...family.home, ...data } }), [family])
  const setStudentRooms = useCallback(data => setFamily({ ...family, home: { ...family.home, studentRooms: data } }), [family])

  return (
    <RegisterFamilyContext.Provider
      value={{
        family,
        setFamily: handleSetFamily,
        setUser,
        setMainMembers,
        setFamilyMembers,
        setPets,
        setHome,
        setStudentRooms
      }}
    >
      { props.children }
    </RegisterFamilyContext.Provider>
  )
}