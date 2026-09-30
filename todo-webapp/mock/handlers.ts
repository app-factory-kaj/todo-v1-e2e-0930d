import { http, HttpResponse } from "msw";
import type { components } from "../src/generated/todo-api";

type Todo = components["schemas"]["Todo"];
type ApiError = components["schemas"]["Error"];

// Held in module scope so the app behaves like an app: a create shows up in
// the next list, a delete removes it, an edit persists — for as long as this
// page stays open. A reload re-runs this module and puts the seed back
// (react-webapp's mock-mode.md, "Hold state in module scope").
let todos: Todo[] = [
  { id: "1", title: "Buy milk", completed: false },
  { id: "2", title: "Write the report", completed: true },
  { id: "3", title: "Walk the dog", completed: false },
];
let nextId = 4;

function badTitle(message: string) {
  const body: ApiError = { code: 400, message };
  return HttpResponse.json(body, { status: 400 });
}

function notFound() {
  const body: ApiError = { code: 404, message: "No todo with that id" };
  return HttpResponse.json(body, { status: 404 });
}

export const handlers = [
  // GET /todos — paginated per the contract's own limit/offset, most-specific
  // path (a literal) needs no ordering care here since there is only one.
  http.get("/api/todos", ({ request }) => {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? "20"), 100);
    const offset = Number(url.searchParams.get("offset") ?? "0");
    const page = todos.slice(offset, offset + limit);
    const nextOffset = offset + limit;
    return HttpResponse.json({
      count: todos.length,
      next: nextOffset < todos.length ? `/todos?limit=${limit}&offset=${nextOffset}` : null,
      previous: offset > 0 ? `/todos?limit=${limit}&offset=${Math.max(0, offset - limit)}` : null,
      data: page,
    });
  }),

  http.post("/api/todos", async ({ request }) => {
    const input = (await request.json()) as { title?: unknown };
    const title = typeof input?.title === "string" ? input.title : "";
    if (title.trim().length === 0) {
      return badTitle("title is required");
    }
    const created: Todo = { id: String(nextId++), title, completed: false };
    todos = [...todos, created];
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put("/api/todos/:id", async ({ request, params }) => {
    const existing = todos.find((t) => t.id === params.id);
    if (!existing) return notFound();
    const input = (await request.json()) as { title?: unknown; completed?: unknown };
    if (input.title !== undefined) {
      const title = typeof input.title === "string" ? input.title : "";
      if (title.trim().length === 0) {
        return badTitle("title must not be empty");
      }
    }
    const updated: Todo = {
      ...existing,
      ...(input.title !== undefined ? { title: input.title as string } : {}),
      ...(input.completed !== undefined ? { completed: Boolean(input.completed) } : {}),
    };
    todos = todos.map((t) => (t.id === updated.id ? updated : t));
    return HttpResponse.json(updated, { status: 200 });
  }),

  http.delete("/api/todos/:id", ({ params }) => {
    const before = todos.length;
    todos = todos.filter((t) => t.id !== params.id);
    return before === todos.length ? notFound() : new HttpResponse(null, { status: 204 });
  }),
];
