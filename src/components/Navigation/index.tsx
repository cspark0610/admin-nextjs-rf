import React from "react";
import Link from "next/link";
//styles
import styles from "styles/Navigation/navigation.module.scss";
import Icon from "components/UI/Atoms/Icon";
import { signout } from "next-auth/client";

export default function Navigation() {
  return (
    <div className={styles.navigation}>
      <ul className={styles.nav}>
        <li className={styles.logo}>
          <Link href="/">
            <a>
              <img src="/assets/logo-redleaf.svg" alt="Redleaf logo" />
              <Icon svg="double-arrow" classes="nav_icon" />
            </a>
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/families">
            <a className={styles.link}>
              <Icon svg="family" classes="nav_icon" />
              <span className={styles.text}>Families</span>
            </a>
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/users">
            <a className={styles.link}>
              <Icon svg="users" classes="nav_icon" />
              <span className={styles.text}>Users</span>
            </a>
          </Link>
        </li>
        <li className={styles.item}>
          <Link href="/misc">
            <a className={styles.link}>
              <Icon svg="misc" classes="nav_icon" />
              <span className={styles.text}>Misc</span>
            </a>
          </Link>
        </li>
        <li className={styles.item} onClick={() => signout({ callbackUrl: '/login' })}>
          <Link href="#">
            <a className={styles.link}>
              <Icon svg="logout" classes="nav_icon" />
              <span className={styles.text}>Logout</span>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
