// main tools
import Head from 'next/head'
import Image from 'next/image'
import type { FC } from 'react'

// styles
import styles from 'styles/Home.module.scss'

// components
import Navigation from 'components/Navigation'

const Home: FC = () => (
  <div className={styles.container}>
    <Head>
      <title>Redleaf admin</title>
      <meta name='admin for redleaf' />
      <link rel='icon' href='/favicon.ico' />
    </Head>
    
    <section>
      <Navigation/>
      <main  className={styles.main}>
        <h1>Family list</h1>
      </main>
    </section>
    
     
    

    
  </div>
)

export default Home
