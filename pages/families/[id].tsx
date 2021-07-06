import React, { useEffect,useState, useMemo } from 'react'
import {useRouter} from 'next/router'
//service
import FamiliesService from "services/Families";
import GenericsService from 'services/Generics'
//components
import Layout from 'components/Layout'
import { Topbar } from 'components/Families/topbar'
import Tabs from 'components/Families/tabs'
//context
import { FamilyContext } from 'context/FamilyContext'

export default function Family() {
    const [family, setFamily] = useState(null)
    const providerValue = useMemo(()=> ({family, setFamily}), [family,setFamily])
    const [generics, setGenerics] = useState({})
    const router = useRouter()
    
    useEffect(() => {
        if(router.query.id)
        (async () => {
            const familiesService = new FamiliesService() 
            const data = await familiesService.getFamily(router.query.id)
            setFamily(data)   
        })()
        return(
            ()=> {}
        )
    }, [router.query])

    useEffect(()=> {
        (async ()=> {
            const genericsService = new GenericsService()
            const data = genericsService.getAll()
            setGenerics(data)
            console.log(generics)
        })()
    },[])
    
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
