import React from 'react'
//components
import Layout from 'components/Layout'
import Topbar from 'components/Families/topbar'
import Tabs from 'components/Families/tabs'

export default function Family() {
    return (
        <Layout noPadding>
            <Topbar/>
            <Tabs/>
        </Layout>
    )
}
