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

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')
app.use(express.static(publicDir))

app.get('/api/sightings', async (req, res) => {
  const result = await pool.query('SELECT * FROM sightings ORDER BY id')
  res.json(result.rows)
})

app.get('/api/stats', async (req, res) => {
  const total = (await pool.query('SELECT COUNT(*)::int AS c FROM sightings')).rows[0].c

  const mostType = (await pool.query(
    'SELECT ghost_type, COUNT(*)::int AS c FROM sightings GROUP BY ghost_type ORDER BY c DESC'
  )).rows[0].ghost_type

  const highActivity = (await pool.query(
    'SELECT COUNT(*)::int AS c FROM sightings WHERE witnesses > 5'
  )).rows[0].c

  const topCity = (await pool.query(
    'SELECT l.city AS city, COUNT(*)::int AS c FROM sightings s JOIN locations l ON s.location_id = l.id GROUP BY l.city ORDER BY c DESC'
  )).rows[0].city

  res.json({ total, mostType, highActivity, topCity })
})

app.get('/api/sightings/search', async (req, res) => {
  const wanted = req.query.type
  const result = await pool.query('SELECT * FROM sightings WHERE ghost_type = $1', [wanted])
  res.json(result.rows)
})

app.get('/api/sightings/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM sightings WHERE id = $1', [req.params.id])

  if (result.rows.length === 0){
    return res.status(404).json({error: 'Sighting not found'})
  }

  res.json(result.rows[0])

})

app.post('/api/sightings', async (req, res) => {
  res.status(501).json({ error: 'TODO 2 not done' })
})


if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(3000, () => console.log('HAUnted Sightings on http://localhost:3000'))
}
