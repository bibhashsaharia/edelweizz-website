// Read-only Growth OS data adapter. Browser receives only public Supabase key,
// never the service-role key. Every table is still enforced by database RLS.
const projectUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
const sessionKey = 'edelweizz-growth-session-v1'

export function isConfigured() {
  return Boolean(projectUrl && publicKey)
}

function readStoredSession() {
  try { return JSON.parse(window.sessionStorage.getItem(sessionKey) || 'null') }
  catch { return null }
}

function saveSession(session) {
  window.sessionStorage.setItem(sessionKey, JSON.stringify(session))
}

function acceptLoginRedirect() {
  const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  if (fragment.has('error')) {
    const message = fragment.get('error_description') || 'Google sign-in was not completed.'
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
    throw new Error(message)
  }
  if (!fragment.has('access_token')) return
  const expiresIn = Number(fragment.get('expires_in') || 3600)
  saveSession({
    access_token: fragment.get('access_token'),
    refresh_token: fragment.get('refresh_token'),
    expires_at: Date.now() + expiresIn * 1000,
  })
  // Remove access/refresh tokens from the URL immediately.
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

async function refreshSession(session) {
  if (!session?.refresh_token) return null
  const response = await fetch(projectUrl + '/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    headers: { apikey: publicKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  })
  if (!response.ok) return null
  const result = await response.json()
  const refreshed = {
    access_token: result.access_token,
    refresh_token: result.refresh_token,
    expires_at: Date.now() + Number(result.expires_in || 3600) * 1000,
  }
  saveSession(refreshed)
  return refreshed
}

export async function getSession() {
  if (!isConfigured()) return null
  acceptLoginRedirect()
  const saved = readStoredSession()
  if (!saved?.access_token) return null
  if (saved.expires_at > Date.now() + 60000) return saved
  const refreshed = await refreshSession(saved)
  if (!refreshed) window.sessionStorage.removeItem(sessionKey)
  return refreshed
}

export function signInWithGoogle() {
  if (!isConfigured()) throw new Error('Supabase public environment variables are not configured.')
  const redirect = window.location.origin + window.location.pathname
  const authorize = new URL(projectUrl + '/auth/v1/authorize')
  authorize.searchParams.set('provider', 'google')
  authorize.searchParams.set('redirect_to', redirect)
  window.location.assign(authorize.toString())
}

export function signOut() {
  window.sessionStorage.removeItem(sessionKey)
  window.location.reload()
}

async function selectRows(table, query, accessToken) {
  const endpoint = new URL(projectUrl + '/rest/v1/' + table)
  for (const [key, value] of Object.entries(query)) endpoint.searchParams.set(key, value)
  const response = await fetch(endpoint.toString(), {
    headers: { apikey: publicKey, Authorization: 'Bearer ' + accessToken, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!response.ok) {
    let detail = {}
    try { detail = await response.json() } catch { /* keep generic error */ }
    const error = new Error(detail.message || 'Unable to read ' + table)
    error.status = response.status
    error.code = detail.code
    throw error
  }
  return response.json()
}

export async function loadGrowthDashboard() {
  if (!isConfigured()) return { state: 'configuration_missing' }
  const session = await getSession()
  if (!session) return { state: 'signed_out' }

  const workspaces = await selectRows('growth_workspaces', {
    select: 'id,name,status,autonomy_mode',
    limit: '1',
  }, session.access_token)
  if (!workspaces.length) return { state: 'access_denied' }
  const workspace = workspaces[0]
  const workspaceFilter = 'eq.' + workspace.id
  const query = (columns, extra = {}) => ({
    select: columns, workspace_id: workspaceFilter, ...extra,
  })

  const [integrations, goals, metricPoints, opportunities, runs] = await Promise.all([
    selectRows('growth_integrations', query('provider,connection_status,last_synced_at,last_error'), session.access_token),
    selectRows('growth_goals', query('name,metric_key,target_value,period,is_active', { is_active: 'eq.true' }), session.access_token),
    selectRows('growth_metric_points', query('metric_key,metric_value,source,observed_on,recorded_at', { order: 'observed_on.desc,recorded_at.desc', limit: '150' }), session.access_token),
    selectRows('growth_opportunities', query('title,channel,rationale,priority_score,status', { order: 'detected_at.desc', limit: '25' }), session.access_token),
    selectRows('growth_runs', query('run_kind,status,started_at,completed_at', { order: 'created_at.desc', limit: '10' }), session.access_token),
  ])

  let leads = null
  try {
    leads = await selectRows('growth_leads', query('id,stage,source,channel,received_at', { order: 'received_at.desc', limit: '1000' }), session.access_token)
  } catch (error) {
    // Proposed lead schema is intentionally not deployed. Do not misrepresent it as zero.
    if (!['PGRST205', '42P01'].includes(error.code) && error.status !== 404) throw error
  }
  return { state: 'ready', workspace, integrations, goals, metricPoints, opportunities, runs, leads }
}
