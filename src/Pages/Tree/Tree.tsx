import style from './Tree.module.scss'

export const Tree = () => {
    return <div className={style.container}>
        <div className={style.headerWrapper}>
            <span>Treeheader</span>
        </div>
        <div>
            content
        </div>
    </div>
}