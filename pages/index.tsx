import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { getHint } from '@/logic/hint'
import { getWord } from '@/logic/word'

export default function Home() {
  const [word, setWord] = useState("")
  const [hint, setHint] = useState("")
  useEffect(() => {
    (async () => {
      const initWord = getWord()
      await showHint(initWord)
    })()
  }, [])
  const showHint = async (initWord: string | null = null) => {
    const keyWord = initWord || getWord()
    setHint("考え中...")
    setWord(keyWord)
    console.log(keyWord)
    const result = await getHint(keyWord)
    setHint(result)
  }
  return (
    <>
      <Head>
        <title>whatword</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div>
          <button onClick={showHint}>新しい問題を出題</button>
          <h1>{word}</h1>
          <input type="text" />
          <button >回答</button>
          <p>あるキーワード(英単語)をテーマにしてAIがポエムを作ったよ。<br />
            キーワードが何か予想してみよう。</p>
          <pre>{hint}</pre>
        </div>
      </main>
    </>
  )
}
