# Todo App — PRD

## Problem Statement

People who want to jot down and track small tasks often reach for sticky notes
or scattered text files, which are easy to lose and offer no simple way to see
what is done and what is still open. They need one lightweight, always-visible
place to list what needs doing and check it off as it gets done.

## Solution

A minimal todo application: a REST API backed by an in-memory store that
supports creating, listing, updating, completing and deleting todos, paired
with a single-page web app that calls that API. There is no sign-in of any
kind — anyone who opens the app sees and edits one shared list of todos.

## Actors

- **User** — anyone who opens the web app. There is no sign-in and no
per-account distinction: every user sees and edits the same shared list of
todos.

## User Stories

1. As a user, I want to add a new todo with a title, so that I can capture
 something I need to do.
2. As a user, I want to see the list of all todos, so that I can review what
 needs doing and what is already done.
3. As a user, I want to change a todo's title, so that I can correct or
 refine it after creating it.
4. As a user, I want to mark a todo as complete (and reopen it if needed), so
 that I can track my progress on it.
5. As a user, I want to delete a todo, so that I can remove items I no longer
 need.

## Product Decisions

- **No sign-in or authentication of any kind.** Stated directly by the
requester; this overrides the organization's usual default of signing every
web app in through the platform IDP. There are no accounts, roles or
permissions in this product.
- **One single shared todo list.** With no accounts to distinguish visitors,
every user reads and writes the same list — there is no private,
per-visitor data.
- **A todo has exactly two fields: a title and a completed flag.** No
description, due date, priority or other metadata.
- **No database and no platform resources.** All todos live in the API
service's in-memory store, as stated in the brief; data does not survive a
restart of the service.
- **No third-party or external services** are used anywhere in this product.

## Out of Scope

- User accounts, authentication, or any per-user/private todo lists.
- Persistence of todos across restarts, or any database/storage layer.
- Todo metadata beyond a title and a completed flag (no due dates,
priorities, descriptions, tags, or attachments).
- Multi-device sync, offline support, or real-time collaboration features
beyond the single shared list being visible to whoever opens the app.
- Notifications, reminders, or any external integrations.

## Open Questions

None — the brief and interview settled every product-level decision.