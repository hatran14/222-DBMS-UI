import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import HomePage from './home'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Home: NextPage = () => {
    const { push } = useRouter()
    useEffect(() => {
        push('/home');
    });
    return (
        <div className={styles.container}>
        </div>
    )
}

export default Home
