// public/app.js - the dashboard. It fetches the API and fills the page.
// There is ONE bug in here (see the table). Everything else is correct.
async function json(url) { const r = await fetch(url); return { status: r.status, body: await r.json().catch(() => null) } }

async function loadStats() {
  const { body } = await json('/api/stats')
  document.getElementById('total').textContent = body.total
  document.getElementById('mostType').textContent = body.mostType
  document.getElementById('highActivity').textContent = body.highActivity
  document.getElementById('topCity').textContent = body.topCity
}

async function loadTable() {
  const { body } = await json('/api/sightings')
  const tbody = document.getElementById('rows')
  tbody.innerHTML = ''
  for (const s of body.slice(0, 25)) {
    const tr = document.createElement('tr')
    // BUG E: one of these reads a field that does not exist on the row, so that
    //        column shows "undefined". Fix the field name.
    tr.innerHTML = `<td>${s.id}</td>
                    <td>${s.ghost_type}</td>
                    <td>${s.witnesses}</td>
                    <td>${s.location_id}</td>
                    <td>${(s.reported_at || '').slice(0,10)}</td>`
    tbody.appendChild(tr)
  }
}

document.getElementById('filterBtn').onclick = async () => {
  const type = document.getElementById('typeInput').value
  const { body } = await json('/api/sightings/search?type=' + encodeURIComponent(type))
  document.getElementById('filterResult').textContent = Array.isArray(body) ? `${body.length} sightings` : 'error'
}

document.getElementById('lookupBtn').onclick = async () => {
  const id = document.getElementById('idInput').value
  const { status, body } = await json('/api/sightings/' + encodeURIComponent(id))
  const el = document.getElementById('lookupResult')
  if (status === 404) el.textContent = 'No sighting with that id.'
  else if (body && body.ghost_type) el.textContent = `Sighting ${body.id}: ${body.ghost_type}, ${body.witnesses} witnesses`
  else el.textContent = 'The look-up route is not working yet.'
}

loadStats(); loadTable()
