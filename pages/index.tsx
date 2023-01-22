import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect } from 'react'
import { getHint } from '@/logic/hint'

export default function Home() {
  useEffect(() => {
    (async () => {
      const result = await getHint("cat")
    })()
  }, [])
  return (
    <>
      <Head>
        <title>whatword</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        hello
      </main>
    </>
  )
}
