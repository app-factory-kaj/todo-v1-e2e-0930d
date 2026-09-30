import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Form,
  FormControlLabel,
  PageContent,
  PageTitle,
  Switch,
  TextField,
  Typography,
} from "@wso2/oxygen-ui";
import { todoApi, listAllTodos } from "../api";

// wireframes.dsl, screen TodoDetail:
//   navbar "Todo App"
//   heading "Todo"
//   input "Title"
//   row
//     toggle "Completed"
//     right
//     button "Delete" danger
//   row
//     right
//     button "Save" primary -> TodoList
export default function TodoDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load(): Promise<void> {
      setLoading(true);
      // openapi.yaml declares no "get one todo" operation — the list is the
      // only reach, so the detail screen finds its row there.
      const todos = await listAllTodos();
      if (cancelled) return;
      const todo = todos.find((t) => t.id === id);
      if (!todo) {
        setNotFound(true);
      } else {
        setTitle(todo.title);
        setCompleted(todo.completed);
      }
      setLoading(false);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave(): Promise<void> {
    if (!id) return;
    setSaving(true);
    setSaveError(null);
    const { error } = await todoApi.PUT("/todos/{todoId}", {
      params: { path: { todoId: id } },
      body: { title, completed },
    });
    setSaving(false);
    if (error) {
      // The API's own 400 (empty title) or 404 (deleted meanwhile) — shown
      // verbatim, and the screen stays put rather than pretending to have saved.
      setSaveError(error.message);
      return;
    }
    navigate("/todos");
  }

  async function handleDelete(): Promise<void> {
    if (!id) return;
    setDeleting(true);
    const { response } = await todoApi.DELETE("/todos/{todoId}", {
      params: { path: { todoId: id } },
    });
    setDeleting(false);
    // 204 on success, 404 if it was already gone — either way there is
    // nothing left to show here, so both return to the shared list.
    if (response.status === 204 || response.status === 404) {
      navigate("/todos");
    }
  }

  return (
    <PageContent>
      <PageTitle>
        <PageTitle.Header>Todo</PageTitle.Header>
      </PageTitle>

      {loading ? (
        <Typography>Loading…</Typography>
      ) : notFound ? (
        <Typography color="error">This todo no longer exists.</Typography>
      ) : (
        <Form.Section>
          <Form.Stack spacing={3}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (saveError) setSaveError(null);
              }}
              error={saveError !== null}
              helperText={saveError ?? " "}
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <FormControlLabel
                control={<Switch checked={completed} onChange={(e) => setCompleted(e.target.checked)} />}
                label="Completed"
              />
              <Button variant="outlined" color="error" onClick={() => void handleDelete()} disabled={deleting}>
                Delete
              </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={() => void handleSave()} disabled={saving}>
                Save
              </Button>
            </Box>
          </Form.Stack>
        </Form.Section>
      )}
    </PageContent>
  );
}
