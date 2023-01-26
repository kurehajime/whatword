import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { getHint } from '@/logic/hint'
import { getWord } from '@/logic/word'
import Result from '@/compornents/result'
import Ai from '@/compornents/ai'

export default function Home() {
  const [word, setWord] = useState("")
  const [hint, setHint] = useState(`ランダムなキーワード(英単語)をテーマにして
AIがポエムを作るよ。
キーワードが何か予想してみよう。`)
  const [turn, setTurn] = useState(0)
  const [input, setInput] = useState("")
  const [messege, setMessege] = useState("")
  const [thinking, setThinking] = useState(false)
  const showHint = async () => {
    const word = getWord()
    setThinking(true)
    setTurn(0)
    setWord(word)
    setMessege("")
    setInput("")
    console.log(word)
    setHint("ポエムを考え中...")
    const result = await getHint(word)
    const regexp = /^[0-9]\.\s*(.*)/mg;
    setHint(result.trim().replaceAll(regexp, '$1').split('\n').slice(0, 4).join('\n'))
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
        <div className='grid grid-cols-2 gap-4'>
          <div className='grid grid-flow-row auto-rows-max'>
            <h1 className='text-3xl text-blue-500 font-black'>AIポエムクイズ</h1>
            <button onClick={showHint}
              className="btn w-64 rounded-full"
            >問題を出題</button>
            <Result keyword={word} turn={turn} />
            <input type="text" value={input} onChange={onChange} onKeyDown={onKeyDown}
              placeholder="英単語で回答してね"
              className="input input-bordered w-full max-w-xs" />
            <button onClick={answer}
              className="btn w-64 rounded-full"
            >回答</button>
            <p>{messege}</p>
          </div>
          <div>
            {
              <Ai
                thinking={thinking}
                message={hint}
              />
            }
          </div>
        </div>
      </main>
    </>
  )
}
