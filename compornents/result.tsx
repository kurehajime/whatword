type Props = {
    keyword: string
    turn: number
}

export default function Result(props: Props) {
    const size = 50
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
        <svg height={size} width={size * maxLength}>
            {
                result.map((char, index) => {
                    return (<g key={index}>
                        <rect x={index * size} y={0} width={size} height={size} fill="white" stroke="black" />
                        <text x={index * size + size / 2} y={size / 2} textAnchor="middle" alignmentBaseline="middle" fontSize={size / 2}>{char}</text>
                        {
                            char === '' ? <line x1={(index + 1) * size} y1={0} x2={index * size} y2={size} stroke="black" /> : <></>
                        }
                    </g>)
                })
            }
        </svg>
    )
}