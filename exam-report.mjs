// Prints your current answers for the 10 quiz questions. Run locally with
// `npm run exam`, or read it from the GitHub Actions run summary after you push.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async (p) => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }
const stats = (await get('/api/stats')).body || {}
const wl = (await get('/api/sightings/search?type=' + encodeURIComponent('white lady'))).body
const one = await get('/api/sightings/42')
const bad = await get('/api/sightings/999999')
let postStatus
try {
  const r = await fetch(base + '/api/sightings', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location_id: 1, ghost_type: 'orb', witnesses: 1, reported_at: '2026-01-01' }) })
  postStatus = r.status
} catch { postStatus = '(app not running)' }
const line = (n, label, val) => console.log(`Q${n}`.padEnd(4) + label.padEnd(28) + ': ' + val)
line(1, 'Total sightings', stats.total)
line(2, 'Most common type', stats.mostType)
line(3, 'High activity (> 5)', stats.highActivity)
line(4, 'Busiest city', stats.topCity)
line(5, 'white lady count', Array.isArray(wl) ? wl.length : '(filter not fixed yet)')
line(6, 'Type column BEFORE fixing', 'read this off the ORIGINAL buggy dashboard')
line(7, 'Sighting 42 ghost_type', one.status === 200 ? one.body.ghost_type : '(look-up route not added yet)')
line(8, 'Sighting 42 witnesses', one.status === 200 ? one.body.witnesses : '(look-up route not added yet)')
line(9, 'GET unknown id -> status', bad.status)
line(10, 'POST -> status', postStatus)
server.close()
