import { Dela_Gothic_One } from "@next/font/google";
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState } from 'react'
import { getHint } from '@/logic/hint'
import { getWord } from '@/logic/word'
import Result from '@/compornents/result'
import Ai from '@/compornents/ai'
import Poem from '@/compornents/poem'
import Message from '@/compornents/message'
const font = Dela_Gothic_One({ weight: "400", subsets: ['latin'], display: 'fallback' })

export default function Home() {
  const [word, setWord] = useState("")
  const [hint, setHint] = useState(`ポエムを作るよ！`)
  const [turn, setTurn] = useState(0)
  const [input, setInput] = useState("")
  const [messege, setMessege] = useState("")
  const [thinking, setThinking] = useState(false)
  const [start, setStart] = useState(false)
  const [end, setEnd] = useState(false)
  const [success, setSuccess] = useState(false)
  const showHint = async () => {
    const word = getWord()
    setThinking(true)
    setStart(false)
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
    setStart(true)
    setEnd(false)
    setSuccess(false)
  }
  const answer = () => {
    if (input.toLocaleUpperCase() === word.toLocaleUpperCase()) {
      setSuccess(true)
      setEnd(true)
      setMessege("正解！")
      setTurn(8)
    } else if (turn >= word.length - 1) {
      setEnd(true)
      setInput("")
      setMessege("残念、ゲームオーバー")
      setTurn(8)
    } else {
      setMessege("違うよ！")
      setInput("")
      setTurn(turn + 1)
    }
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value.toUpperCase())
  }
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !end) {
      answer()
    }
  }
  return (
    <>
      <Head>
        <title>AIポエムクイズ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AIが考えたポエムのテーマを当ててみよう" />
        <meta property="og:url" content="https://whatword-5dyx7gwrfq-an.a.run.app/" />
        <meta property="og:type" content="game" />
        <meta property="og:title" content="AIポエムクイズ" />
        <meta property="og:description" content="AIが考えたポエムのテーマを当ててみよう" />
        <meta property="og:site_name" content="AIポエムクイズ" />
        <meta property="og:image"
          content="https://user-images.githubusercontent.com/4569916/216822011-48036c18-e873-43b6-b238-0a39fd149a4b.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@kurehajime" />
        <meta name="twitter:creator" content="@kurehajime" />
      </Head>
      <main className={styles.main}>
        <div className='md:flex w-full gap-5 md:pt-5'>
          <div className='grow-0 w-84'>
            <div className="p-2">
              <h1 className={font.className + ' text-3xl'}>AIポエムクイズ</h1>
            </div>

            {start ? <div className='card w-84 bg-base-100 shadow-xl'>
              <div className='card-body'>
                <Result keyword={word} turn={turn} success={success} end={end} />
                <input type="text" value={input} onChange={onChange} onKeyDown={onKeyDown}
                  placeholder="英単語で回答してね"
                  className="input input-bordered w-full max-w-xs" />
                <div className="card-actions justify-end">
                  {
                    end ? <button onClick={showHint}
                      className={`btn ${success ? 'btn-accent' : 'btn-secondary'}`}
                    >もう一度遊ぶ</button> : <button onClick={answer}
                      className="btn btn-primary"
                    >回答</button>
                  }
                </div>
              </div>

            </div> : <div className='card w-84 bg-base-100 shadow-xl'>
              <div className='card-body'>
                <h2 className='card-title'>ルール</h2 >
                <ul className='list-disc'>
                  <li>秘密のキーワードが何かを当ててみよう</li>
                  <li>AIがそのキーワードをもとにポエムを作るよ</li>
                  <li>誤回答するごとに1文字ずつ公開されるよ</li>
                </ul>
                <div className="card-actions justify-end">
                  <button onClick={showHint}
                    className="btn btn-accent"
                    disabled={thinking}
                  >問題を出題</button>
                </div>
              </div>
            </div>
            }
          </div>
          <div className='grow pt-3'>
            <Poem
              message={hint}
            />
            <div className='flex'>
              <div className='w-48'>
                <Message
                  message={messege}
                />
              </div>
              <div>
                <Ai
                  thinking={thinking}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
