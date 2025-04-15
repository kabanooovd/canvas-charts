import { useNavigate } from 'react-router-dom'
import style from './Snake.module.scss'
import { SnakeCanvas } from './SnakeCanvas/SnakeCanvas'
import { useState } from 'react'

export const Snake = () => {
    const navi = useNavigate()

    const [score, setScore] = useState<number>(0)

    const title = `Змейка (score: ${score}) - для старта нажать стрелку на клаве`

    return <div className={style.container}>
        <div className={style.headerWrapper}>
            <span>{title}</span>
            <div className={style.goBackWrapper} onClick={() => navi('/')}>
                <span>Назад</span>
            </div>
        </div>
        <div className={style.contentWrapper}>
            <SnakeCanvas setScore={setScore} />
        </div>
    </div>
}