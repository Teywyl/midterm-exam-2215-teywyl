// Non-scoring self-check. Your grade is the Canvas quiz; this only tells you
// whether each bug and TODO is fixed. It computes the correct answer from the
// data itself and compares it to your app, so no answers are written here.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import { app } from '../app.js'
import { pool } from '../db.js'

let server, base
beforeAll(() => { server = app.listen(0); base = `http://localhost:${server.address().port}` })
afterAll(() => server && server.close())
const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

describe('Module 5 - the stats queries', () => {
  it('BUG A: "most common type" is the MOST frequent type', async () => {
    const expected = (await pool.query(
      'SELECT ghost_type FROM sightings GROUP BY ghost_type ORDER BY COUNT(*) DESC, ghost_type LIMIT 1'
    )).rows[0].ghost_type
    expect((await get('/api/stats')).body.mostType).toBe(expected)
  })
  it('BUG B: "high activity" counts sightings with MORE THAN 5 witnesses', async () => {
    const expected = (await pool.query('SELECT COUNT(*)::int AS c FROM sightings WHERE witnesses > 5')).rows[0].c
    expect((await get('/api/stats')).body.highActivity).toBe(expected)
  })
  it('BUG C: "busiest city" groups by city, not building', async () => {
    const expected = (await pool.query(
      'SELECT l.city FROM sightings s JOIN locations l ON s.location_id = l.id GROUP BY l.city ORDER BY COUNT(*) DESC, l.city LIMIT 1'
    )).rows[0].city
    expect((await get('/api/stats')).body.topCity).toBe(expected)
  })
})

describe('Module 4 - the routes', () => {
  it('BUG D: the type filter returns only the requested type', async () => {
    const { body } = await get('/api/sightings/search?type=' + encodeURIComponent('white lady'))
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
    expect(body.every((r) => r.ghost_type === 'white lady')).toBe(true)
  })
  it('TODO 1: GET /api/sightings/:id returns the matching row', async () => {
    const { status, body } = await get('/api/sightings/42')
    expect(status).toBe(200)
    expect(body.id).toBe(42)
  })
  it('TODO 1: an unknown id returns 404', async () => {
    expect((await get('/api/sightings/999999')).status).toBe(404)
  })
  it('TODO 2: POST /api/sightings creates a row and returns 201', async () => {
    const r = await fetch(base + '/api/sightings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location_id: 1, ghost_type: 'selftest', witnesses: 3, reported_at: '2026-01-01' }),
    })
    const body = await r.json().catch(() => null)
    expect(r.status).toBe(201)
    expect(body && body.ghost_type).toBe('selftest')
    expect(body && body.id).toBeGreaterThan(0)
  })
})

describe('The dashboard', () => {
  it('BUG E: the table reads ghost_type, not a field that does not exist', () => {
    const src = fs.readFileSync(new URL('../public/app.js', import.meta.url), 'utf8')
    expect(src).not.toMatch(/\.ghosttype\b/)
    expect(src).toMatch(/\.ghost_type\b/)
  })
})
