import React, {useState, useEffect} from 'react'
import { Button } from 'primereact/button';
//styles
import classes from 'styles/UI/Molecules/FormHeader.module.scss'
import UsersService from 'services/Users';
import { useSession } from 'next-auth/client';
interface Props {
    title: string,
    isLoading?: boolean
    onClick: ()=> void
}

const FormHeader : React.FC<Props>= ({title, isLoading, onClick}) => {
    const [session,] = useSession()
    const [ActiveUser, setActiveUser] = useState('')
    const getUser = () => {
      UsersService.getUser(session?.token, session?.user)
        .then((response) => setActiveUser(response.userType))
        .catch((error) => console.error(error))
    }
    useEffect(() => {
      if(session?.user){
        getUser()
      }
    }, [session])
    return (
        <div className={classes.container}>
            <h1>{title}</h1>
            {ActiveUser !== 'Reader' &&
            <Button onClick={onClick} loading={isLoading} label="Save" icon="pi pi-save" className="p-button-rounded" />
            }
        </div>
    )
}

export default  FormHeader
