import React from 'react'
//service
import FamiliesService from "services/Families";
//components
import Layout from 'components/Layout'
import {Topbar} from 'components/Families/topbar'
import Tabs from 'components/Families/tabs'
//context
import{ FamilyContext }from 'context/FamilyContext'

export const getServerSideProps = async (ctx) => {
    try {
        const familiesService = new FamiliesService()   
        const data = await familiesService.getFamily(ctx.query.id)
        return {
            props: {
                data
            }
        }  
    } catch (err) {
        console.log(err)
    }
    
} 

export default function Family({data}) {
    const {name,familyScore,familyInternalData} = data
    console.log(data)
    return (
        <Layout noPadding>
            <FamilyContext.Provider value={data}>
                <Topbar data={{name, familyScore, familyType: familyInternalData.type, familyStatus: familyInternalData.status}}/>
                <Tabs/>
            </FamilyContext.Provider>
        </Layout>
    )
}
