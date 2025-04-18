import { useNavigate } from 'react-router-dom'
import style from './Default.module.scss'

export const Default = () => {
    const navi = useNavigate()
    const list = [
        { route: '/okls', title: 'ОКЛС' },
        { route: '/oth', title: 'ОТХ' },
        { route: '/lf16', title: 'ЛФ16' },
        { route: '/oko', title: 'OKO' },
        { route: '/snake', title: 'Игра' }
    ]

    // TODO: сделать ui поприличнее
    return <div className={style.container}>
        <h3>Компоненты графиков на канвасе</h3>
        {list.map(({ route, title }) => {
            const onHndleClick = () => navi(route)
            return <div key={route} className={style.routeWrapper} onClick={onHndleClick}>
                <span>{title}</span>
            </div>
        })}
    </div>
}