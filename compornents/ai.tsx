import styles from '@/styles/ai.module.css'
import Image from 'next/image'
import imgPath from '@/public/thinking.png'
type Props = {
    thinking: boolean
}

export default function Ai(props: Props) {

    return (
        <div className={styles.ai}>
            <Image
                className={' ' + (props.thinking ? styles.thinking : '')}
                src={imgPath}
                width={200}
                height={200}
                alt='thinking...' />
        </div>)
}