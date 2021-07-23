import React from "react";
import Link from "next/link";
//styles
import styles from "styles/Navigation/navigation.module.scss";
import Icon from "components/UI/Atoms/Icon";
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
          <Link href="/configuration">
            <a className={styles.link}>
              <Icon svg="misc" classes="nav_icon" />
              <span className={styles.text}>Configuration</span>
            </a>
          </Link>
        </li>
        <li className={styles.item}>
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
