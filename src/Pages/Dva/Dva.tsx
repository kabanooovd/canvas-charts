import style from './Dva.module.scss'

export const Dva = () => {
    return <div className={style.container}>
        <div className={style.headerWrapper}>
            <span>Dvaheader</span>
        </div>
        <div>
            content
        </div>
    </div>
}