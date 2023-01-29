import styles from '@/styles/poem.module.css'

type Props = {
    message: string
}

export default function Poem(props: Props) {
    return (<div>
        <div className={styles.balloon}>
            <pre>
                {props.message}
            </pre>
        </div>
        <div className={styles.horn}>▼</div>
    </div>)
}