import { type RouteProps, Navigate } from "react-router";
import AppLayout from "../layouts/AppLayout";
import TodoList from "../pages/TodoList";
import TodoDetail from "../pages/TodoDetail";

export interface AppRoute extends Omit<RouteProps, "children"> {
  children?: AppRoute[];
  label?: string;
}

// No sign-in and one flow ("Manage todos"): TodoList is the app's only
// landing screen, reached straight from "/".
const appRoutes: AppRoute[] = [
  { path: "/", element: <Navigate to="/todos" replace /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/todos", element: <TodoList />, label: "Todos" },
      { path: "/todos/:id", element: <TodoDetail /> },
    ],
  },
];

export default appRoutes;
