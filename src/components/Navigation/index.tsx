// main tools
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

// bootstrap components
import { ChevronDoubleLeft } from 'react-bootstrap-icons'
import { Spinner } from 'react-bootstrap'

// utils
import { UserTypes } from 'utils/commons'

//styles
import styles from 'styles/Navigation/navigation.module.scss'

// types
import { FC } from 'react'

export const Navigation: FC = () => {
  const { data, status } = useSession()

  return (
    <div className={styles.navigation}>
      <ul className={styles.nav}>
        <li className={styles.logo}>
          <Link href='/'>
            <a>
              <img
                alt='Redleaf logo'
                className={styles.img}
                src='/assets/logo-redleaf.svg'
              />
              <ChevronDoubleLeft className={styles.arrow} />
            </a>
          </Link>
        </li>
        {status === 'loading' ? (
          <div className={styles.loader}>
            <Spinner animation='grow' />
          </div>
        ) : (
          <>
            <li className={styles.item}>
              <Link href='/families'>
                <a className={styles.link}>
                  <img
                    alt='Redleaf logo'
                    className={styles.icon}
                    src='/assets/icons/families.svg'
                  />
                  <span className={styles.text}>Families</span>
                </a>
              </Link>
            </li>
            {data?.user.userType !== UserTypes.LOCAL_COORDINATOR && (
              <li className={styles.item}>
                <Link href='/users'>
                  <a className={styles.link}>
                    <img
                      alt='Redleaf logo'
                      className={styles.icon}
                      src='/assets/icons/users.svg'
                    />
                    <span className={styles.text}>Users</span>
                  </a>
                </Link>
              </li>
            )}
            {data?.user.userType === UserTypes.SUPER_USER && (
              <li className={styles.item}>
                <Link href='/configuration'>
                  <a className={styles.link}>
                    <img
                      alt='Redleaf logo'
                      className={styles.icon}
                      src='/assets/icons/config.svg'
                    />
                    <span className={styles.text}>Configuration</span>
                  </a>
                </Link>
              </li>
            )}
          </>
        )}

        <li
          className={styles.item}
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <p role='button' className={styles.link}>
            <img
              alt='Redleaf logo'
              className={styles.icon}
              src='/assets/icons/signout.svg'
            />
            <span className={styles.text}>Logout</span>
          </p>
        </li>
      </ul>
    </div>
  )
}
