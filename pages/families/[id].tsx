import React, { useEffect,useState, useMemo, useContext } from 'react'
import {useRouter} from 'next/router'
//service
import FamiliesService from "services/Families";
//components
import { ProgressSpinner } from 'primereact/progressspinner';
import Layout from 'components/Layout'
import { Topbar } from 'components/Families/topbar'
import Tabs from 'components/Families/tabs'
//context
import { FamilyContext, FamilyProvider } from 'context/FamilyContext'
//utils
import { useSession } from 'next-auth/client';

export default function Family() {
    const [session, loading] = useSession()
    const router = useRouter()

    const { family, getFamily } = useContext(FamilyContext)
    
    useEffect(() => {
        if(router.query.id && getFamily !== undefined)
            getFamily()
    }, [router.query, session, getFamily])

    if(!family) {
        return <div className="preloader_container">
            <ProgressSpinner/>
            </div>
    }
    return (
        <Layout noPadding>
            <Topbar/>
            <Tabs/>
        </Layout>
    )
}
