import { useNavigate } from 'react-router-dom'
import { GraphOkls } from './GraphOkls/GraphOkls'
import style from './OKLS.module.scss'

export const OKLS = () => {
    const navi = useNavigate()
    const incomingData = {
        "diagnosisConclusion": [
          {
            "scale": "ОКО",
            "result": null,
            "addon": null,
            "interpretations": [
              "Обесценивание. Негативная оценка себя, своего прошлого и будущих перспектив, декларация безнадежности и обесценивание усилий, навешивание негативных ярлыков, блокировка деятельности из-за преувеличенно негативного прогноза. ",
              "Долженствование. Повышенная моральная ответственность, стремление к обеспечению безопасности за счет морального контроля над окружающими. Проявления: преобладание моральных суждений и оценок в восприятии явлений и людей, представляющих потенциальное неудобство или опасность. ",
              "Амбициозность. Максимализм и крайность в оценках, потребность в восхищении, выражающаяся через нарциссическую безупречность. Проявления: крайность в суждениях.",
              "Индивидуализм. Настойчивое стремление отстаивать свою самооценку, связанное со страхом ошибиться. Негибкость суждений, преобладание эгоцентрических защитных суждений и бездействия, склонность явно или скрыто оспаривать мнение и предложения других людей «из принципа», отождествляя себя с предметом спора.  ",
              "Нарциссизм. Декларация собственной исключительности, неконструктивное соперничество, не насыщаемая потребность в признании, восхищении, безупречности в глазах окружающих, безапелляционное признание собственной правоты как компенсация неуверенности и недостаточного самоуважения."
            ]
          }
        ],
        "diagnosisChart": {
          "name": "OKO",
          "datasets": {
            "Пациент": [
              {
                "name": "Ex/ln",
                "value": 12
              },
              {
                "name": "Se/Nt",
                "value": 4
              },
              {
                "name": "Fe/Th",
                "value": 11
              },
              {
                "name": "Ju/Pe",
                "value": 3
              }
            ],
            "Норма": [
              {
                "name": "Ex/ln",
                "value": 2
              },
              {
                "name": "Se/Nt",
                "value": 8
              },
            ]
          }
        }
      }


    return <div className={style.container}>
        <div className={style.headerWrapper}>
            <span>График ОКЛС</span>
            <div className={style.goBackWrapper} onClick={() => navi('/')}>
                <span>Назад</span>
            </div>
        </div>
        <div className={style.contentWrapper}>
            <GraphOkls data={incomingData.diagnosisChart.datasets['Пациент']} />
        </div>
    </div>
}