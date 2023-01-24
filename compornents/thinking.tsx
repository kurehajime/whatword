
import Image from 'next/image'
import imgPath from '@/public/thinking.png'
import styles from '@/styles/Thinking.module.css'
type Props = {
}

export default function Thinking(props: Props) {
    return (<Image
        className={styles.thinking}
        src={imgPath}
        width={100}
        height={100}
        alt='thinking...' />)
}