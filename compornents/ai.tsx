import styles from '@/styles/ai.module.css'
import Image from 'next/image'
import imgPath from '@/public/thinking.png'
type Props = {
    message: string
    thinking: boolean
}

export default function Ai(props: Props) {

    return (
        <div className={styles.ai}>
            <div>
                <div>
                    <div className={styles.balloon}>
                        <pre>
                            {props.message}
                        </pre>
                    </div>
                    <div className={styles.horn}>▼</div>
                </div>
                <div>
                    <Image
                        className={' ' + (props.thinking ? styles.thinking : '')}
                        src={imgPath}
                        width={100}
                        height={100}
                        alt='thinking...' />
                </div>
            </div>
        </div>)
}