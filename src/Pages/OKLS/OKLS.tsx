import { useNavigate } from 'react-router-dom'
import { GraphOkls } from './GraphOkls/GraphOkls'
import style from './OKLS.module.scss'

export const OKLS = () => {
    const navi = useNavigate()
    const incomingData = {
      "comment": null,
      "diagnosisConclusion": [],
      "diagnosisChart": {
        "name": "Опросник когнитивных стилей (ОКС)",
        "conclusionMarker": "OKLS",
        "datasets": {
          "Опросник когнитивных стилей (ОКС)": [
            {
              "name": "Ex/In",
              "value": 7
            },
            {
              "name": "Se/Nt",
              "value": 8
            },
            {
              "name": "Fe/Th",
              "value": 9
            },
            {
              "name": "Ju/Pe",
              "value": 6
            }
          ],
          "Опросник когнитивных стилей (ОКС)2": [
            {
              "name": "Ex/In",
              "value": 7
            },
            {
              "name": "Se/Nt",
              "value": 6
            },
            {
              "name": "Fe/Th",
              "value": 5
            },
            {
              "name": "Ju/Pe",
              "value": 8
            }
          ]
        }
      }
    }

    const nestedDataSet = Object.values(incomingData.diagnosisChart.datasets)
    const firstDataSet = nestedDataSet[0]
    const secondDataSet = nestedDataSet[1]
    const maxY = firstDataSet[0].value + secondDataSet[0].value

    return <div className={style.container}>
        <div className={style.headerWrapper}>
            <span>График ОКЛС</span>
            <div className={style.goBackWrapper} onClick={() => navi('/')}>
                <span>Назад</span>
            </div>
        </div>
        <div className={style.contentWrapper}>
            <GraphOkls data={nestedDataSet[0]} maxY={maxY} />
        </div>
    </div>
}