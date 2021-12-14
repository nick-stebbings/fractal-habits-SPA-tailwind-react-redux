// Pages
import CreateHabit from "../pages/CreateHabit";
import AppendHabit from "../pages/AppendHabit";
import HabitDashboard from "../pages/HabitDashboard";
import HabitTree from "../pages/HabitTree";
import Cluster from "../pages/Cluster";
import RadialTree from "../pages/RadialTree";

let MENU_ROUTES = [
  {
    label: "Visualise",
    path: "/vis",
    subpaths: {
      "/vis/habit-tree": {
        status: "enabled",
        title: "Habit Tree",
        description:
          "A hierarchical tree showing relationships. Add habits above (prepend) or under (append) an existing habit",
        component: HabitTree,
        icon: "anicon",
      },
      "/vis/cluster": {
        status: "enabled",
        title: "Horizontal Cluster",
        description:
          "Fractal pyramid of habits. Navigate all the way up to the sky or drill down into the minutiae.",
        component: Cluster,
        icon: "anicon",
      },
      "/vis/radial-tree": {
        status: "enabled",
        title: "Radial Tree",
        description:
          "A pretty hierarchical tree diagram where your habits branch off from the centre of a circle.",
        component: RadialTree,
        icon: "anicon",
      },
    },
  },
  // {
  //   label: "Habits",
  //   path: "/habits",
  //   subpaths: {
  //     "/habits/new": {
  //       title: "Add a Habit",
  //       status: "enabled",
  //       description:
  //         "Create a blank habit and attach it another habit as a child. First choose by parent habit - the new one is a child",
  //       component: AppendHabit,
  //       icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 -mt-2 " fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>',
  //     },
  //     "/habits/list": {
  //       title: "Habit List",
  //       status: "enabled",
  //       description:
  //         "A flat list of all Habits for your perusal. View descriptions, filter and toggle completion",
  //       component: HabitDashboard,
  //       icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 -mt-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>',
  //     },
  //     "/habits/edit": {
  //       title: "Link Habits",
  //       description:
  //         "Link existing behaviors to a new habit or move habits around.",
  //       component: CreateHabit,
  //       icon: "anicon",
  //     },
  //   },
  // },
];

export const MENU_ROUTE_FIRST_SELECTED = "Habits";

export default MENU_ROUTES;
