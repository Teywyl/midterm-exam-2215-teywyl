// report.js - prints the dashboard values as text, in case you would rather
// read them in the terminal than in the browser. Run with `npm run report`.
import { app } from './app.js'
const server = app.listen(0)
const base = `http://localhost:${server.address().port}`
const get = async p => { const r = await fetch(base + p); return { status: r.status, body: await r.json().catch(() => null) } }

const stats = (await get('/api/stats')).body
console.log('Total sightings :', stats.total)
console.log('Most common type:', stats.mostType)
console.log('High activity   :', stats.highActivity)
console.log('Busiest city    :', stats.topCity)
const wl = (await get('/api/sightings/search?type=' + encodeURIComponent('white lady'))).body
console.log('white lady count:', Array.isArray(wl) ? wl.length : '(filter broken)')
const one = await get('/api/sightings/42')
console.log('sighting 42     :', one.status === 200 ? `${one.body.ghost_type}, ${one.body.witnesses} witnesses` : '(look-up route missing)')
server.close()
