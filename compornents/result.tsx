type Props = {
    keyword: string
    turn: number
}

export default function Result(props: Props) {
    const size = 100
    const length = props.keyword.length
    const word = props.keyword.split("")
    for (let i = 0; i < length; i++) {
        if (i >= props.turn) {
            word[i] = '*'
        }
    }
    return (
        <svg height={size} width={size * length}>
            {
                word.map((char, index) => {
                    return (<>
                        <rect x={index * size} y={0} width={size} height={size} fill="white" stroke="black" />
                        <text x={index * size + size / 2} y={size / 2} textAnchor="middle" alignmentBaseline="middle" fontSize={size / 2}>{char}</text>
                    </>)
                })
            }
        </svg>
    )
}