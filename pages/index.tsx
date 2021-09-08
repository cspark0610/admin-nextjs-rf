// main tools
import type { FC } from 'react'

// components
import Layout from 'components/Layout'
import HomeComponent from 'components/Home'

const Home: FC = () => (
  <Layout noPadding>
    <HomeComponent />
  </Layout>
)

export default Home
