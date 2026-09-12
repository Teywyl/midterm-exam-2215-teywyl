# Midterm Practical Exam - HAUnted Sightings

This is your **midterm exam**. You are given a mostly-working app: a Node/Express
API over a PostgreSQL database, with a small **dashboard** web page. It has a few
**bugs** and two **TODOs**. Fix them so every panel on the dashboard shows the
correct value, then answer the **Canvas exam** with the numbers your fixed app
shows. That is your grade; you do not submit this repo.

## Rules (read first)

- **Closed book. One hour. One sitting.** Open only: this repo, VS Code, and a
  terminal. **No AI assistants, no web search, no messaging.**
- Everything you need is in Modules 4 and 5.
- Your answers go in the **Canvas exam**, not here.

## Setup and run

You do not need to install PostgreSQL - the database runs in memory (200
sightings, the same every run).

```bash
npm install
npm start        # then open http://localhost:3000 for the dashboard
```

Prefer the terminal? `npm run report` prints the same dashboard values as text.

## What to fix

Five bugs, marked in the code with `BUG A` ... `BUG E`, plus two `TODO`s:

- **app.js (Module 4 + 5):**
  - BUG A - "most common type" is showing the least common one.
  - BUG B - "high activity" should be witnesses **greater than 5**.
  - BUG C - "busiest city" should group by **city**, not by building.
  - BUG D - the type filter reads the wrong query-string field.
  - **TODO 1** - there is **no route** to look up one sighting by id. Add
    `GET /api/sightings/:id` (return the row, or a 404 if there is none).
  - **TODO 2** - finish `POST /api/sightings` so it inserts the row and returns
    the created record.
- **public/app.js (the dashboard):**
  - BUG E - the "All sightings" table shows `undefined` in one column because it
    reads a field name that does not exist on the row.

When every dashboard panel shows a sensible value and the look-up box works,
you have fixed everything. Read your answers off the dashboard (or
`npm run report`) and enter them in Canvas.

## No laptop? Fix it in the browser

You do not have to run anything locally. You can edit the files right on
github.com (open a file, click the pencil, commit), and every push runs your app
for you on GitHub. Open the run under the **Actions** tab and its **summary**
shows two things: a self-check of whether each bug and TODO is fixed, and **your
current answers to the 10 quiz questions**. It also saves a screenshot of your
dashboard as the **dashboard-screenshot** artifact.

This check does **not** grade you: your grade is the Canvas quiz. It only tells
you how far you have got. Read your answers from the run summary (or, if you can
run it, `npm run report`) and enter them in Canvas.

## The data

Two tables: **locations** (8 haunted places across a few cities) and
**sightings** (200 rows, each linked to a location). Do not edit `db.js`.
Good luck.
