import { useNavigate } from 'react-router-dom'
import style from './Default.module.scss'

export const Default = () => {
    const navi = useNavigate()
    const list = [
        {
            route: '/okls',
            title: 'ОКЛС'
        },
        {
            route: '/2',
            title: 'Dva'
        },
        {
            route: '/3',
            title: 'Tree'
        }
    ]

    // TODO: сделать ui поприличнее
    return <div className={style.container}>
        <h3>Canvases</h3>
        {list.map(({ route, title }) => {
            const onHndleClick = () => navi(route)
            return <div key={route} className={style.routeWrapper} onClick={onHndleClick}>
                <span>{title}</span>
            </div>
        })}
    </div>
}