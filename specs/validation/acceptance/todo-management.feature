Feature: Shared todo list

  @story-1
  Rule: Adding a todo requires a title

    Scenario: Adding a todo with a title
      Given the shared todo list has no todo titled "Buy milk" yet
      When Ravi adds a todo titled "Buy milk"
      Then the shared todo list has exactly one todo titled "Buy milk" and it is not completed

    @negative
    Scenario: A blank title is refused
      Given the shared todo list has a known set of todos
      When Ravi tries to add a todo with an empty title
      Then the shared todo list still has the same set of todos

  @story-2
  Rule: Anyone who opens the app sees the same shared list

    Scenario: Two visitors see the same todos
      Given Ravi has added a todo titled "Buy milk"
      When Priya opens the todo app
      Then Priya sees a todo titled "Buy milk" on her list

  @story-3
  Rule: A todo's title can be changed after creation

    Scenario: Renaming a todo
      Given Ravi has added a todo titled "Buy milk"
      When Ravi changes that todo's title to "Buy oat milk"
      Then the shared todo list has a todo titled "Buy oat milk" and no todo titled "Buy milk"

    @negative
    Scenario: Clearing a todo's title is refused
      Given Ravi has added a todo titled "Buy milk"
      When Ravi tries to change that todo's title to an empty title
      Then the todo is still titled "Buy milk"

  @story-4
  Rule: A todo can be marked complete and reopened again

    Scenario: Completing a todo
      Given Ravi has added a todo titled "Buy milk"
      When Ravi marks that todo as complete
      Then that todo shows as completed

    Scenario: Reopening a completed todo
      Given Ravi has a todo titled "Buy milk" that is marked complete
      When Ravi marks that todo as not complete
      Then that todo shows as not completed

  @story-5
  Rule: A todo can be deleted

    Scenario: Deleting a todo
      Given Ravi has added a todo titled "Buy milk"
      When Ravi deletes that todo
      Then the shared todo list no longer has a todo titled "Buy milk"

    @negative
    Scenario: Deleting a todo that no longer exists is refused
      Given Ravi has already deleted the todo titled "Buy milk"
      When Ravi tries to delete that same todo again
      Then the shared todo list is unchanged
