import React from 'react'
//service
import FamiliesService from "services/Families";
//components
import Layout from 'components/Layout'
import {Topbar} from 'components/Families/topbar'
import Tabs from 'components/Families/tabs'

export const getServerSideProps = async (ctx) => {
    const familiesService = new FamiliesService()   
    const data = await familiesService.getFamily(ctx.query.id)
    return {
        props: {
            data
        }
    }
} 

export default function Family({data}) {
    const {name,familyScore,familyInternalData} = data
    return (
        <Layout noPadding>
            <Topbar data={{name, familyScore, familyType: familyInternalData.type, familyStatus: familyInternalData.status}}/>
            <Tabs/>
        </Layout>
    )
}
