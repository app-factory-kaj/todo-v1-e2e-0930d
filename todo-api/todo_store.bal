// The single, process-wide shared todo list. No database, no persistence:
// every request reads and writes this one in-memory list.
import ballerina/uuid;

Todo[] todos = [];

const int MAX_PAGE_LIMIT = 100;

function isBlankTitle(string title) returns boolean {
    return title.trim().length() == 0;
}

function blankTitleError() returns ErrorBadRequest {
    Error err = {code: 400, message: "Bad Request", description: "title must not be blank"};
    return <ErrorBadRequest>{body: err};
}

function notFoundError(string todoId) returns ErrorNotFound {
    Error err = {code: 404, message: "Not Found", description: string `no todo with id ${todoId}`};
    return <ErrorNotFound>{body: err};
}

function findTodoIndex(string todoId) returns int? {
    foreach int i in 0 ..< todos.length() {
        Todo existing = todos[i];
        if existing.id == todoId {
            return i;
        }
    }
    return ();
}

function addTodo(string title) returns Todo {
    Todo newTodo = {id: uuid:createRandomUuid(), title: title, completed: false};
    todos.push(newTodo);
    return newTodo;
}

function applyUpdate(int index, UpdateTodo payload) returns Todo {
    Todo existing = todos[index];
    string title = existing.title;
    string? newTitle = payload?.title;
    if newTitle is string {
        title = newTitle;
    }
    boolean completed = existing.completed;
    boolean? newCompleted = payload?.completed;
    if newCompleted is boolean {
        completed = newCompleted;
    }
    Todo updated = {id: existing.id, title: title, completed: completed};
    todos[index] = updated;
    return updated;
}

function removeTodoAt(int index) {
    Todo _ = todos.remove(index);
}

function listTodosPage(int 'limit, int offset) returns inline_response_200 {
    int total = todos.length();

    int safeLimit = 'limit;
    if safeLimit > MAX_PAGE_LIMIT {
        safeLimit = MAX_PAGE_LIMIT;
    }
    if safeLimit < 0 {
        safeLimit = 0;
    }

    int safeOffset = offset;
    if safeOffset < 0 {
        safeOffset = 0;
    }

    int startIndex = safeOffset;
    if startIndex > total {
        startIndex = total;
    }
    int endIndex = startIndex + safeLimit;
    if endIndex > total {
        endIndex = total;
    }

    Todo[] pageItems = todos.slice(startIndex, endIndex);

    string? next = ();
    if endIndex < total {
        next = string `/todos?limit=${safeLimit}&offset=${endIndex}`;
    }

    string? previous = ();
    if safeOffset > 0 {
        int previousOffset = safeOffset - safeLimit;
        if previousOffset < 0 {
            previousOffset = 0;
        }
        previous = string `/todos?limit=${safeLimit}&offset=${previousOffset}`;
    }

    return {count: total, next: next, previous: previous, data: pageItems};
}
