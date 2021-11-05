import { useContext, useEffect } from 'react'
// main tools
import { useSession } from 'next-auth/client'
import { signout } from 'next-auth/client'
import Link from 'next/link'
import { FamilyContext } from 'context/FamilyContext'
// components
import Icon from 'components/UI/Atoms/Icon'
import { ProgressSpinner } from 'primereact/progressspinner'
//styles
import styles from 'styles/Navigation/navigation.module.scss'

export default function Navigation() {
  const [session, loading]: [any, boolean] = useSession()
  const { activeUserType, getUser } = useContext(FamilyContext)

  useEffect(() => {
    if ( activeUserType === '' || activeUserType === null || activeUserType === undefined) {
      getUser()
    }
  }, [activeUserType])
  return (
    <div className={styles.navigation}>
      <ul className={styles.nav}>
        <li className={styles.logo}>
          <Link href='/'>
            <a>
              <img src='/assets/logo-redleaf.svg' alt='Redleaf logo' />
              <Icon svg='double-arrow' classes='nav_icon' />
            </a>
          </Link>
        </li>
        {loading ? (
          <div className='preloader_container'>
            <ProgressSpinner />
          </div>
        ) : (
          <>
            <li className={styles.item}>
              <Link href='/families'>
                <a className={styles.link}>
                  <Icon svg='family' classes='nav_icon' />
                  <span className={styles.text}>Families</span>
                </a>
              </Link>
            </li>
            {activeUserType !== 'LocalCoordinator' && (
              <>
                <li className={styles.item}>
                  <Link href='/users'>
                    <a className={styles.link}>
                      <Icon svg='users' classes='nav_icon' />
                      <span className={styles.text}>Users</span>
                    </a>
                  </Link>
                </li>
                
              </>
            )}
            {activeUserType === 'SuperUser' &&
              <>
                <li className={styles.item}>
                  <Link href='/configuration'>
                    <a className={styles.link}>
                      <Icon svg='misc' classes='nav_icon' />
                      <span className={styles.text}>Configuration</span>
                    </a>
                  </Link>
                </li>
              </>
            }
          </>
        )}

        <li
          className={styles.item}
          onClick={() => signout({ callbackUrl: '/login' })}
        >
          <Link href='#'>
            <a className={styles.link}>
              <Icon svg='logout' classes='nav_icon' />
              <span className={styles.text}>Logout</span>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
