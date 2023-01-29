import styles from '@/styles/message.module.css'

type Props = {
    message: string
}

export default function Message(props: Props) {
    return (<div>
        <br />
        <br />
        <br />
        {
            props.message.length > 0 ? <>
                <div className={styles.balloon}>
                    <pre>
                        {props.message}
                    </pre>
                </div>
                <div className={styles.horn}>▶</div>
            </> : <></>
        }

    </div>)
}