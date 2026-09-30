screen TodoList "The one shared list everyone sees"
  navbar "Todo App"
  heading "My Todos"
  row
    input "What needs doing?"
    button "Add" primary
  table "Done | Title" -> TodoDetail

screen TodoDetail "View, edit, complete/reopen or delete one todo"
  navbar "Todo App"
  heading "Todo"
  input "Title"
  row
    toggle "Completed"
    right
    button "Delete" danger
  row
    right
    button "Save" primary -> TodoList

flow "Manage todos"
  description "Anyone adds, completes, edits and deletes todos on the one shared list"
  TodoList
  TodoDetail
