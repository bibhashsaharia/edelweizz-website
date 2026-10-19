import { useEffect, useState } from 'react'
import { isConfigured, loadGrowthDashboard, signInWithGoogle, signOut } from './data.js'
import { humanise, latestMetricPoints, metricDisplay, summarizeLeads } from './metrics.js'

const sections = ['Overview', 'Leads', 'Analytics', 'Integrations', 'Opportunities', 'Activity', 'Principles']

const principles = [
  'Every child deserves respect, dignity, safety and genuine opportunities to participate in daily life.',
  'Support should address meaningful goals at home, in school, in relationships and in the wider community—not only therapy-session performance.',
  'Parents are partners in defining goals, reviewing progress and deciding what works for their child.',
  'Neurodiversity is not a marketing hook: avoid fear, cures, guarantees, deficit-only framing and generic stock success stories.',
  'Protect family privacy. Never publish a child’s image, diagnosis, story or testimonial without informed, specific permission.',
  'Show authentic evidence. Do not count WhatsApp button clicks as received enquiries or invented rankings as performance.',
  'Review all public content, reviews, clinical claims and profile changes before publishing. No automatic posting.',
]

function StateMessage({ title, children, onSignIn }) {
  return <div className="growthApp growthGate">
    <main className="panel">
      <p className="eyebrow">EDELWEIZZ · PRIVATE GROWTH WORKSPACE</p>
      <h1>{title}</h1>
      <p>{children}</p>
      {onSignIn && <button className="actionButton" onClick={onSignIn}>Sign in with Google</button>}
    </main>
  </div>
}

function MetricTile({ title, value, detail }) {
  return <article className="panel metricTile">
    <p className="eyebrow">{title}</p>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
}

function Section({ title, eyebrow, children }) {
  return <section className="sectionBlock">
    <div className="sectionHead"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div></div>
    {children}
  </section>
}

function IntegrationList({ integrations }) {
  if (!integrations.length) return <p className="emptyState">No integration records exist yet.</p>
  return <div className="connectorList">
    {integrations.map(({ provider, connection_status, last_synced_at, last_error }) =>
      <div className="connector" key={provider}>
        <div>
          <strong>{humanise(provider)}</strong>
          <span>{last_synced_at ? 'Last sync: ' + new Date(last_synced_at).toLocaleString('en-IN') : 'No verified data sync recorded'}</span>
          {last_error && <small className="errorText">Last error: {last_error}</small>}
        </div>
        <em className={connection_status === 'connected' ? 'ok' : ''}>{humanise(connection_status)}</em>
      </div>
    )}
  </div>
}

function LeadsPanel({ leads, summary }) {
  if (summary === null) return <div className="panel">
    <h3>Lead ledger not activated</h3>
    <p>We have not verified that the live enquiry form saves records in a secure, accessible database. The new lead table is only a reviewed proposal, not a deployed integration. No lead totals can be claimed yet.</p>
    <small>Lead definition: a successfully saved enquiry or a staff-confirmed inbound conversation; not a click, an opened WhatsApp chat, or a draft message.</small>
  </div>
  return <>
    <div className="metricGrid">
      <MetricTile title="Recorded enquiries" value={summary.total} detail={leads.length === 1000 ? 'Up to 1,000 recent records shown; total may be higher.' : 'Stored lead records'} />
      <MetricTile title="Recorded enrolments" value={summary.stages.enrolled} detail="Current lead stage, not total active children" />
      <MetricTile title="Enquiry to enrolment" value={summary.conversionRate === null ? 'Not available' : summary.conversionRate + '%'} detail="Among loaded records; not a cohort-adjusted conversion rate" />
    </div>
    <Section title="Enquiry stages" eyebrow="Recorded funnel">
      <div className="stageGrid">
        {Object.entries(summary.stages).map(([stage, count]) =>
          <div className="panel stageCard" key={stage}><strong>{count}</strong><span>{humanise(stage)}</span></div>
        )}
      </div>
    </Section>
    <Section title="Recent enquiry sources" eyebrow="Verified saved records only">
      {leads.length === 0 ? <p className="emptyState">No saved enquiries have been loaded yet.</p> :
        <div className="panel tableScroll"><table>
          <thead><tr><th>Received</th><th>Source</th><th>Channel</th><th>Stage</th></tr></thead>
          <tbody>{leads.slice(0, 20).map(lead =>
            <tr key={lead.id}><td>{new Date(lead.received_at).toLocaleDateString('en-IN')}</td>
              <td>{humanise(lead.source)}</td><td>{humanise(lead.channel)}</td><td>{humanise(lead.stage)}</td></tr>)}</tbody>
        </table></div>}
      <p className="footnote">Private Growth OS deliberately does not copy children's names, diagnoses, phone numbers or therapy notes into advertising analytics.</p>
    </Section>
  </>
}

function AnalyticsPanel({ points }) {
  const latest = latestMetricPoints(points)
  return <>
    <div className="metricGrid">
      <MetricTile title="Observed measurements" value={points.length} detail="Stored, source-tagged metric records (latest 150 sampled)" />
      <MetricTile title="Distinct measured signals" value={latest.length} detail="No placeholder scores" />
    </div>
    <Section title="Latest sourced measurements" eyebrow="Date and provenance matter">
      {latest.length === 0 ? <div className="panel emptyState">No verified SEO, GA4 or Business Profile measurements have been ingested. An empty dataset is not the same as zero Google traffic.</div> :
        <div className="panel tableScroll"><table>
          <thead><tr><th>Metric</th><th>Value</th><th>Observed</th><th>Source</th></tr></thead>
          <tbody>{latest.map(point => <tr key={point.metric_key}>
            <td>{humanise(point.metric_key)}</td><td>{metricDisplay(point)}</td><td>{point.observed_on}</td><td>{humanise(point.source)}</td>
          </tr>)}</tbody>
        </table></div>}
    </Section>
  </>
}

function OpportunityPanel({ opportunities }) {
  return <Section title="Measured opportunities" eyebrow="Not invented recommendations">
    {!opportunities.length ? <div className="panel emptyState">No evidence-backed Growth OS opportunities have been recorded yet. The action list is in the implementation tracker, not fabricated here.</div> :
      <div className="opportunityList">{opportunities.map((row, index) =>
        <article className="panel opportunity" key={index}>
          <div><small>{humanise(row.channel)} · {humanise(row.status)}</small><h3>{row.title}</h3><p>{row.rationale || 'Evidence not supplied'}</p></div>
          <span>{row.priority_score === null ? 'Unscored' : 'Priority ' + row.priority_score}</span>
        </article>)}</div>}
  </Section>
}

function Overview({ data, summary }) {
  const goal = data.goals.find(item => item.metric_key === 'active_children') || data.goals[0]
  const latest = latestMetricPoints(data.metricPoints)
  const active = latest.find(item => item.metric_key === goal?.metric_key)
  return <>
    <section className="heroGrid">
      <article className="heroCard primaryCard growthPurpose">
        <div>
          <span className="statusPill">Read-only · {humanise(data.workspace.autonomy_mode)}</span>
          <h2>Progress that matters beyond the therapy room.</h2>
          <p>Edelweizz exists to support neurodiverse children and their families with thoughtful care, meaningful daily-life goals, and a more accepting community.</p>
        </div>
        <p className="heroAside">Growth means connecting more families with quality support—not chasing clicks, making clinical promises or overlooking dignity.</p>
      </article>
      <article className="heroCard scoreCard">
        <div><p className="eyebrow">ACTIVE GOAL</p><strong className="goalNumber">{goal ? Number(goal.target_value).toLocaleString('en-IN') : 'Not set'}</strong><p>{goal?.name || 'No active goal has been configured'}</p></div>
        <small>Observed value: {active ? metricDisplay(active) + ' (' + active.observed_on + ')' : 'No verified baseline yet'}</small>
      </article>
    </section>
    <div className="metricGrid">
      <MetricTile title="Saved enquiries" value={summary === null ? 'Not connected' : summary.total} detail={summary === null ? 'Live form destination unverified' : 'Stored leads, not CTA clicks'} />
      <MetricTile title="Search & other signals" value={latest.length} detail="Verified metric types in database" />
      <MetricTile title="Integration records" value={data.integrations.length} detail={data.integrations.filter(i => i.connection_status === 'connected').length + ' connected in Growth OS'} />
      <MetricTile title="Automated actions" value="Disabled" detail="No autonomous publishing or profile edits" />
    </div>
    <Section title="What the numbers actually say" eyebrow="Truthful reporting">
      <div className="panel">
        <p>Growth OS is in measurement setup. Its dashboard reads secured workspace records. It does not infer search rankings, lead volume, or clinical outcomes from assumptions.</p>
        <p className="footnote">Metricool can be separately connected to Instagram and Google Business Profile without Growth OS having an authorised data feed. The statuses below reflect the Growth OS database only.</p>
        <IntegrationList integrations={data.integrations} />
      </div>
    </Section>
  </>
}

function GrowthOS() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [result, setResult] = useState({ state: 'loading' })
  useEffect(() => {
    let active = true
    loadGrowthDashboard()
      .then(next => { if (active) setResult(next) })
      .catch(error => { if (active) setResult({ state: 'error', message: error.message }) })
    return () => { active = false }
  }, [])

  if (!isConfigured() || result.state === 'configuration_missing') return <StateMessage title="Private dashboard not configured">Only public Supabase URL and publishable key belong in the browser. Configure the non-production preview first; never use a service-role credential here.</StateMessage>
  if (result.state === 'loading') return <StateMessage title="Loading your private workspace">Verifying sign-in and protected Growth OS data.</StateMessage>
  if (result.state === 'signed_out') return <StateMessage title="Sign in to Growth OS" onSignIn={signInWithGoogle}>Google sign-in is required. Access to the Growth OS records is restricted by database row-level policies.</StateMessage>
  if (result.state === 'access_denied') return <StateMessage title="Access restricted">Your account has no permission to read this Growth OS workspace. Contact the workspace owner; no data was shown.</StateMessage>
  if (result.state === 'error') return <StateMessage title="Growth OS cannot load">The dashboard could not verify live data: {result.message}. No fallback or example numbers have been substituted.</StateMessage>

  const summary = summarizeLeads(result.leads)
  return <div className="growthApp">
    <aside className="sidebar">
      <div className="brandBlock"><div className="brandMark">E</div><div><strong>Edelweizz</strong><span>Growth OS</span></div></div>
      <nav aria-label="Growth OS sections">
        {sections.map(tab => <button type="button" key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} aria-current={activeTab === tab ? 'page' : undefined}>{tab}</button>)}
      </nav>
      <div className="sideFooter"><span className="pulseDot" /> Protected workspace<small>Data is read-only; no live website changes</small><button className="signOutButton" onClick={signOut}>Sign out</button></div>
    </aside>
    <main className="mainPanel">
      <header className="topbar"><div><p className="eyebrow">EDELWEIZZ · TRUSTWORTHY GROWTH</p><h1>{activeTab}</h1></div><span className="readOnlyBadge">Read-only measurement</span></header>
      {activeTab === 'Overview' && <Overview data={result} summary={summary} />}
      {activeTab === 'Leads' && <LeadsPanel leads={result.leads} summary={summary} />}
      {activeTab === 'Analytics' && <AnalyticsPanel points={result.metricPoints} />}
      {activeTab === 'Integrations' && <Section eyebrow="Actual connection state" title="Growth OS data sources"><div className="panel"><IntegrationList integrations={result.integrations}/></div></Section>}
      {activeTab === 'Opportunities' && <OpportunityPanel opportunities={result.opportunities} />}
      {activeTab === 'Activity' && <Section eyebrow="Actual engine records" title="Run history">{result.runs.length === 0 ? <div className="panel emptyState">No automation runs have been recorded. No background optimisation is running here.</div> : <div className="panel tableScroll"><table><thead><tr><th>Run</th><th>Status</th><th>Started</th></tr></thead><tbody>{result.runs.map((run, i) => <tr key={i}><td>{humanise(run.run_kind)}</td><td>{humanise(run.status)}</td><td>{run.started_at ? new Date(run.started_at).toLocaleString('en-IN') : 'Not started'}</td></tr>)}</tbody></table></div>}</Section>}
      {activeTab === 'Principles' && <Section eyebrow="Why the centre exists" title="A child-first promise"><div className="panel"><p>Support meaningful participation, well-being, independence and belonging, while protecting the child's choice and comfort. Families shape the journey.</p><ul className="principles">{principles.map(rule => <li key={rule}>{rule}</li>)}</ul></div></Section>}
    </main>
  </div>
}

export default GrowthOS
