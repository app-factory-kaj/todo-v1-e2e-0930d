import { useEffect, useState, type JSX } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Chip,
  ListingTable,
  PageContent,
  PageTitle,
  TextField,
  Typography,
} from "@wso2/oxygen-ui";
import { todoApi, listAllTodos, type Todo } from "../api";

// wireframes.dsl, screen TodoList:
//   navbar "Todo App"
//   heading "My Todos"
//   row
//     input "What needs doing?"
//     button "Add" primary
//   table "Done | Title" -> TodoDetail
export default function TodoList(): JSX.Element {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function reload(): Promise<void> {
    setLoading(true);
    setLoadError(null);
    try {
      setTodos(await listAllTodos());
    } catch {
      setLoadError("Could not load the todo list.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  async function handleAdd(): Promise<void> {
    setAdding(true);
    setAddError(null);
    const { data, error } = await todoApi.POST("/todos", {
      body: { title: newTitle },
    });
    setAdding(false);
    if (error) {
      // The API's own 400 for a blank title — shown back verbatim rather than
      // a re-derived message, so the feedback always matches the contract.
      setAddError(error.message);
      return;
    }
    setTodos((prev) => [...prev, data]);
    setNewTitle("");
  }

  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>My Todos</PageTitle.Header>
        <PageTitle.SubHeader>The one shared list everyone sees</PageTitle.SubHeader>
      </PageTitle>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: 3 }}>
        <TextField
          label="What needs doing?"
          value={newTitle}
          onChange={(e) => {
            setNewTitle(e.target.value);
            if (addError) setAddError(null);
          }}
          error={addError !== null}
          helperText={addError ?? " "}
          fullWidth
        />
        <Button variant="contained" onClick={() => void handleAdd()} disabled={adding}>
          Add
        </Button>
      </Box>

      {loadError ? (
        <Typography color="error">{loadError}</Typography>
      ) : (
        <ListingTable.Container disablePaper>
          <ListingTable>
            <ListingTable.Head>
              <ListingTable.Row>
                <ListingTable.Cell>Done</ListingTable.Cell>
                <ListingTable.Cell>Title</ListingTable.Cell>
              </ListingTable.Row>
            </ListingTable.Head>
            <ListingTable.Body>
              {!loading && todos.length === 0 ? (
                <ListingTable.Row>
                  <ListingTable.Cell colSpan={2}>
                    <ListingTable.EmptyState
                      title="No todos yet"
                      description="Add the first one above."
                    />
                  </ListingTable.Cell>
                </ListingTable.Row>
              ) : (
                todos.map((todo) => (
                  <ListingTable.Row
                    key={todo.id}
                    clickable
                    onClick={() => navigate(`/todos/${todo.id}`)}
                  >
                    <ListingTable.Cell>
                      <Chip
                        label={todo.completed ? "Done" : "Open"}
                        color={todo.completed ? "success" : "default"}
                        size="small"
                      />
                    </ListingTable.Cell>
                    <ListingTable.Cell>{todo.title}</ListingTable.Cell>
                  </ListingTable.Row>
                ))
              )}
            </ListingTable.Body>
          </ListingTable>
        </ListingTable.Container>
      )}
    </PageContent>
  );
}
