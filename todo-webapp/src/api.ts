// The todo-api client, generated from its openapi.yaml (src/generated/todo-api.ts)
// and reached same-origin through nginx's /api proxy — never a window._env_ URL.
import createClient from "openapi-fetch";
import type { components, paths } from "./generated/todo-api";

export const todoApi = createClient<paths>({ baseUrl: "/api" });

export type Todo = components["schemas"]["Todo"];
export type ApiError = components["schemas"]["Error"];

const PAGE_LIMIT = 100; // the contract's own maximum

/**
 * Every todo on the shared list, paged through with the contract's own
 * `limit`/`offset` params. openapi.yaml declares no "get one" operation, so
 * TodoDetail also uses this to find a single todo by id — there is no
 * operation to invent one from.
 */
export async function listAllTodos(): Promise<Todo[]> {
  const all: Todo[] = [];
  let offset = 0;
  // A loop guard against a misbehaving API rather than an assumption about
  // list size — real usage stops as soon as a page reports no `next`.
  for (let i = 0; i < 1000; i++) {
    const { data, error } = await todoApi.GET("/todos", {
      params: { query: { limit: PAGE_LIMIT, offset } },
    });
    if (error) throw new Error("Could not load the todo list");
    all.push(...data.data);
    if (!data.next || data.data.length === 0) break;
    offset += PAGE_LIMIT;
  }
  return all;
}
