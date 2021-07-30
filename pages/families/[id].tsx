import React, { useEffect,useState, useMemo } from 'react'
import {useRouter} from 'next/router'
//service
import FamiliesService from "services/Families";
//components
import Layout from 'components/Layout'
import { Topbar } from 'components/Families/topbar'
import Tabs from 'components/Families/tabs'
//context
import { FamilyContext } from 'context/FamilyContext'
//utils
import formatName from 'utils/formatName'
import { useSession } from 'next-auth/client';

export default function Family() {
    const [family, setFamily] = useState(null)
    const providerValue = useMemo(()=> ({family, setFamily}), [family,setFamily])
    const [session, loading] = useSession()
    const router = useRouter()
    
    useEffect(() => {
        if(router.query.id)
        (async () => {
            const data = await FamiliesService.getFamily(session?.token, router.query.id)
            setFamily({...data, name:formatName(data.mainMembers)}) 
            console.log('data: ',data) 
        })()
        return(
            ()=> {}
        )
    }, [router.query, session])
    
    if(!family) {
        return <div>loading</div>
    }
    return (
        <Layout noPadding>
            <FamilyContext.Provider value={providerValue}>
                <Topbar/>
                <Tabs/>
            </FamilyContext.Provider>
        </Layout>
    )
}
