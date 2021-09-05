import {createRouter, createWebHashHistory} from 'vue-router'
import CompetitionCalendar from "../components/CompetitionCalendar";
import TeamCalendar from "../components/TeamCalendar";
import CompetitionList from "../components/CompetitionList";
import TeamList from "../components/TeamList";
import HomePage from "../components/HomePage";

const routes = [
    {
        path: '/calendar/competition',
        component: CompetitionCalendar
    },
    {
        path: '/calendar/team',
        component: TeamCalendar
    },
    {
        path: '/competitions',
        component: CompetitionList
    },
    {
        path: '/teams',
        component: TeamList
    },
    {
        path: '/',
        component: HomePage
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
