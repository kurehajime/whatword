import styles from '@/styles/result.module.css'
import { Dela_Gothic_One } from "@next/font/google";
const font = Dela_Gothic_One({ weight: "400", subsets: ['latin'], display: 'fallback' })

type Props = {
    keyword: string
    turn: number
    end: boolean
    success: boolean
}

export default function Result(props: Props) {
    const size = 32
    const maxLength = 8
    const length = props.keyword.length
    const word = props.keyword.split("")
    const result: string[] = []
    for (let i = 0; i < maxLength; i++) {
        if (i < length) {
            if (i >= props.turn) {
                result.push('*')
            } else {
                result.push(word[i])
            }
        } else {
            result.push('')
        }

    }
    return (
        <svg height={size} width={size * maxLength} className={props.success ? styles.success : ''}>
            {
                result.map((char, index) => {
                    return (<g key={index}>
                        <rect x={index * size} y={0} width={size} height={size}
                            fill={props.success ? "greenyellow" : props.end ? "hotpink" : "white"}
                            stroke="black" />
                        <text x={index * size + size / 2} y={size / 2} textAnchor="middle" alignmentBaseline="middle" fontSize={size / 2}
                            className={font.className + ' ' + styles.text}
                            fill={props.success ? "white" : "black"}
                        >{char}</text>
                        {
                            char === '' ? <line x1={(index + 1) * size} y1={0} x2={index * size} y2={size} stroke="black" /> : <></>
                        }
                    </g>)
                })
            }
        </svg>
    )
}