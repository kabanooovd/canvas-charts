import style from './Odin.module.scss'

export const Odin = () => {
    return <div className={style.container}>
        <div className={style.headerWrapper}>
            <span>Odinheader</span>
        </div>
        <div>
            content
        </div>
    </div>
}