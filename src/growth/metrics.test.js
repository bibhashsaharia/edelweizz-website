import test from 'node:test'
import assert from 'node:assert/strict'
import { summarizeLeads, latestMetricPoints, metricDisplay } from './metrics.js'

test('uninstalled lead ledger is unknown, not zero', () => {
  assert.equal(summarizeLeads(null), null)
})

test('empty ledger has zero recorded enquiries but no conversion rate', () => {
  assert.deepEqual(summarizeLeads([]), {
    total: 0, stages: { new: 0, contacted: 0, assessment_booked: 0, assessment_completed: 0, enrolled: 0, closed: 0 },
    conversionRate: null,
  })
})

test('conversion is computed from actually stored records, not click events', () => {
  const records = ['new', 'contacted', 'assessment_booked', 'enrolled', 'closed'].map((stage) => ({ stage }))
  const summary = summarizeLeads(records)
  assert.equal(summary.total, 5)
  assert.equal(summary.stages.enrolled, 1)
  assert.equal(summary.conversionRate, 20)
})

test('metric freshness and source are retained and missing values omitted', () => {
  const metrics = latestMetricPoints([
    { metric_key: 'gsc_clicks', metric_value: 2, observed_on: '2026-10-01', source: 'gsc' },
    { metric_key: 'gsc_clicks', metric_value: 5, observed_on: '2026-10-16', source: 'gsc' },
    { metric_key: 'gsc_impressions', metric_value: null, observed_on: '2026-10-16' },
  ])
  assert.equal(metrics.length, 1)
  assert.equal(metrics[0].metric_value, 5)
  assert.equal(metrics[0].source, 'gsc')
  assert.equal(metricDisplay(metrics[0]), '5')
})
