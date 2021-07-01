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

export default function Family() {
    const [family, setFamily] = useState(null)
    const providerValue = useMemo(()=> ({family, setFamily}), [family,setFamily])
    const router = useRouter()
    
    useEffect(() => {
        (async () => {
            const familiesService = new FamiliesService()
            const data = await familiesService.getFamily(router.query.id)
            setFamily(data)   
        })()
    }, [])
    
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
