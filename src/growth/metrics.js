// Pure, conservative reporting helpers. These never invent missing measurements.
export const LEAD_STAGES = ['new', 'contacted', 'assessment_booked', 'assessment_completed', 'enrolled', 'closed']

export function summarizeLeads(leads) {
  if (leads === null) return null // Lead ledger is not installed/available.
  const stages = Object.fromEntries(LEAD_STAGES.map((stage) => [stage, 0]))
  for (const lead of leads) {
    if (Object.hasOwn(stages, lead.stage)) stages[lead.stage] += 1
  }
  const total = leads.length
  const enrolled = stages.enrolled
  return {
    total,
    stages,
    conversionRate: total === 0 ? null : Math.round((enrolled / total) * 1000) / 10,
  }
}

export function latestMetricPoints(points) {
  const newest = new Map()
  for (const point of points) {
    if (!point.metric_key || point.metric_value === null) continue
    const previous = newest.get(point.metric_key)
    const date = String(point.observed_on || '') + String(point.recorded_at || '')
    const previousDate = previous ? String(previous.observed_on || '') + String(previous.recorded_at || '') : ''
    if (!previous || date > previousDate) newest.set(point.metric_key, point)
  }
  return [...newest.values()].sort((a, b) => a.metric_key.localeCompare(b.metric_key))
}

export function metricDisplay(metric) {
  const n = Number(metric.metric_value)
  if (!Number.isFinite(n)) return 'Not available'
  return Number.isInteger(n) ? n.toLocaleString('en-IN') : n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

export function humanise(value) {
  return String(value ?? '').replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}
