import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { getHint } from '@/logic/hint'
import { getWord } from '@/logic/word'
import Result from '@/compornents/result'
import Thinking from '@/compornents/thinking'

export default function Home() {
  const [word, setWord] = useState("")
  const [hint, setHint] = useState("")
  const [turn, setTurn] = useState(0)
  const [input, setInput] = useState("")
  const [messege, setMessege] = useState("")
  const [thinking, setThinking] = useState(false)
  const showHint = async () => {
    const word = await getWord()
    setThinking(true)
    setWord(word)
    console.log(word)
    setMessege("")
    setTurn(0)
    const result = await getHint(word)
    setHint(result)
    setThinking(false)
  }
  const answer = () => {
    if (input.toLocaleUpperCase() === word.toLocaleUpperCase()) {
      setMessege("正解！")
    } else {
      setMessege("違うよ！")
      setTurn(turn + 1)
      setInput("")
    }
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase())
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      answer()
    }
  }
  return (
    <>
      <Head>
        <title>whatword</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={styles.main}>
        <div>
          <h1>AIポエムクイズ</h1>
          <p>ランダムなキーワード(英単語)をテーマにしてAIがポエムを作るよ。<br />
            キーワードが何か予想してみよう。</p>
          <button onClick={showHint}>問題を出題</button>
          <br />
          <Result keyword={word} turn={turn} />
          <br />
          <input type="text" value={input} onChange={onChange} onKeyDown={onKeyDown}
            placeholder="英単語で回答してね" />
          <button onClick={answer} >回答</button>
          <p>{messege}</p>
          <br />
          {
            thinking ? <Thinking /> : <pre>{hint}</pre>
          }

        </div>
      </main>
    </>
  )
}
