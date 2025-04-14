import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './Layout'
import { Default, OKLS, OTH, LF16, Oko } from './Pages'
import { JSX } from 'react'

interface IRoutes {
    route: string
    component: JSX.Element
    title: string | null
}

export const routesConfig: IRoutes[] = [
    { route: '/', component: <Default />, title: null },
    { route: '/okls', component: <OKLS />, title: null },
    { route: '/oth', component: <OTH />, title: null },
    { route: '/lf16', component: <LF16 />, title: null },
    { route: '/oko', component: <Oko />, title: null },
]

export const router = createBrowserRouter([
    { element: <Layout />, children: routesConfig.map(({ route, component }) => ({ path: route, element: component })) }
])