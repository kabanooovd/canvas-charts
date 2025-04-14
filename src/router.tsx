import { createBrowserRouter } from 'react-router-dom'

import { Layout } from './Layout'
import { Default, OKLS, Dva, Tree } from './Pages'
import { JSX } from 'react'

interface IRoutes {
    route: string
    component: JSX.Element
    title: string | null
}

export const routesConfig: IRoutes[] = [
    { route: '/', component: <Default />, title: null },
    { route: '/okls', component: <OKLS />, title: null },
    { route: '/2', component: <Dva />, title: null },
    { route: '/3', component: <Tree />, title: null }
]

export const router = createBrowserRouter([
    { element: <Layout />, children: routesConfig.map(({ route, component }) => ({ path: route, element: component })) }
])