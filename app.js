// app.js - the HAUnted Sightings app (Module 4 + Module 5).
//
// This app MOSTLY works. It serves a dashboard at http://localhost:3000 that
// reads from the API below. But there are a few BUGS to fix and two TODOs to
// finish. Start it with `npm start`, open the dashboard, and make every panel
// show correct numbers. `npm run report` prints the same values as text.
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './db.js'

export const app = express()
app.use(express.json())
// Serve the dashboard from this file's own folder, so it works no matter which
// directory you start the server from. (Infrastructure - not one of the bugs.)
const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
app.use(express.static(publicDir))

// GET /api/sightings - every sighting. (Worked example - do not change.)
app.get('/api/sightings', async (req, res) => {
  const result = await pool.query('SELECT * FROM sightings ORDER BY id')
  res.json(result.rows)
})

// GET /api/stats - the numbers the dashboard panels show.
// This route runs, but THREE of its queries are wrong. Fix them so each panel
// is correct.
app.get('/api/stats', async (req, res) => {
  const total = (await pool.query('SELECT COUNT(*)::int AS c FROM sightings')).rows[0].c

  // BUG A: "most common ghost type" is coming out as the LEAST common one.
  const mostType = (await pool.query(
    'SELECT ghost_type, COUNT(*)::int AS c FROM sightings GROUP BY ghost_type ORDER BY c DESC'
  )).rows[0].ghost_type

  // BUG B: "high activity" should be sightings with MORE THAN 5 witnesses.
  const highActivity = (await pool.query(
    'SELECT COUNT(*)::int AS c FROM sightings WHERE witnesses > 5'
  )).rows[0].c

  // BUG C: "busiest city" should group by CITY, but it groups by the location's
  //        name, so each building is counted on its own.
  const topCity = (await pool.query(
    'SELECT l.city AS city, COUNT(*)::int AS c FROM sightings s JOIN locations l ON s.location_id = l.id GROUP BY l.city ORDER BY c DESC'
  )).rows[0].city

  res.json({ total, mostType, highActivity, topCity })
})

// GET /api/sightings/search?type=... - sightings of one ghost_type.
// BUG D: it reads the wrong query-string field, so the filter never matches.
app.get('/api/sightings/search', async (req, res) => {
  const wanted = req.query.ghost_type   // the dashboard sends ?type=...
  const result = await pool.query('SELECT * FROM sightings WHERE ghost_type = $1', [wanted])
  res.json(result.rows)
})

// TODO 1: there is NO route to look up a single sighting by id, so the
//         dashboard's "Look up a sighting" box is broken. Add
//         GET /api/sightings/:id here. Return the one matching row, or respond
//         with the "not found" status code if there is no such sighting.

// POST /api/sightings - add a new sighting from the JSON body.
// TODO 2: insert a row from the body (location_id, ghost_type, witnesses,
//         reported_at) and respond with the created row and the "created"
//         status code.
app.post('/api/sightings', async (req, res) => {
  res.status(501).json({ error: 'TODO 2 not done' })
})

if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('HAUnted Sightings on http://localhost:3000'))
}
