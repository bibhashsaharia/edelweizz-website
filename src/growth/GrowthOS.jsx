import { useMemo, useState } from 'react'

const agents = [
  { name: 'Local SEO Agent', mission: 'Keep Google Business Profile complete, fresh and conversion-ready.', status: 'Ready', mode: 'Auto' },
  { name: 'Website SEO Agent', mission: 'Audit technical SEO, intent coverage, schema and internal links.', status: 'Ready', mode: 'Auto' },
  { name: 'Content Agent', mission: 'Turn search demand and parent questions into useful local content.', status: 'Ready', mode: 'Guarded' },
  { name: 'Reputation Agent', mission: 'Monitor reviews, draft replies and surface recurring parent themes.', status: 'Ready', mode: 'Guarded' },
  { name: 'Conversion Agent', mission: 'Track calls, WhatsApp clicks and assessment enquiries to outcomes.', status: 'Ready', mode: 'Auto' },
  { name: 'Growth Strategist', mission: 'Prioritise opportunities by expected impact, confidence and effort.', status: 'Learning', mode: 'Auto' },
]

const connectors = [
  { name: 'Google Business Profile', state: 'Needs OAuth', detail: 'Profile, posts, reviews, performance' },
  { name: 'Google Search Console', state: 'Needs OAuth', detail: 'Queries, pages, CTR and positions' },
  { name: 'PageSpeed / Lighthouse', state: 'Available', detail: 'Performance, accessibility, SEO audits' },
  { name: 'Website', state: 'Connected', detail: 'edelweizzindia.com repository + public pages' },
  { name: 'Supabase', state: 'Connected', detail: 'Tenant-aware operational data layer' },
  { name: 'WhatsApp / Calls', state: 'Planned', detail: 'Lead attribution and follow-up outcomes' },
]

const opportunities = [
  { title: 'Own “pediatric therapy Sarjapur” intent', channel: 'SEO', impact: 94, confidence: 86, action: 'Create local intent cluster + strengthen service pages' },
  { title: 'Increase Google profile conversion signals', channel: 'Local', impact: 91, confidence: 90, action: 'Complete services, fresh media, weekly posts and review cadence' },
  { title: 'Turn FAQ demand into search landing pages', channel: 'Content', impact: 83, confidence: 82, action: 'Promote high-value parent questions into indexable pages' },
  { title: 'Improve mobile assessment conversion', channel: 'CRO', impact: 78, confidence: 74, action: 'Test sticky WhatsApp / call CTA and shorter enquiry path' },
]

const activity = [
  { when: 'Now', text: 'Repository and website context loaded', type: 'done' },
  { when: 'Now', text: 'Growth OS isolated from public website on feature branch', type: 'done' },
  { when: 'Next', text: 'Connect Google Business Profile and Search Console', type: 'next' },
  { when: 'Next', text: 'Run baseline local + technical SEO audit', type: 'next' },
  { when: 'Then', text: 'Start daily autonomous optimisation loop', type: 'queued' },
]

const guardrails = [
  'Never publish medical claims or guarantees without approval.',
  'Never fabricate reviews, ratings, testimonials or citations.',
  'Never change core business identity, address, phone or opening hours without approval.',
  'Auto-publish only low-risk SEO/content changes that pass brand and quality checks.',
  'Log every autonomous decision, source signal, action and rollback point.',
]

function ScoreRing({ value, label }) {
  const deg = Math.round((value / 100) * 360)
  return (
    <div className="scoreWrap">
      <div className="scoreRing" style={{ '--score': `${deg}deg` }}>
        <div><strong>{value}</strong><span>/100</span></div>
      </div>
      <p>{label}</p>
    </div>
  )
}

function GrowthOS() {
  const [autonomy, setAutonomy] = useState('Guarded Autopilot')
  const [activeTab, setActiveTab] = useState('Command Center')
  const overall = useMemo(() => Math.round((72 + 61 + 68 + 54) / 4), [])

  return (
    <div className="growthApp">
      <aside className="sidebar">
        <div className="brandBlock">
          <div className="brandMark">E</div>
          <div><strong>Edelweizz</strong><span>Growth OS</span></div>
        </div>
        <nav>
          {['Command Center', 'Opportunities', 'Automations', 'Content', 'Reputation', 'Leads', 'Analytics', 'Integrations', 'Settings'].map((item) => (
            <button key={item} className={activeTab === item ? 'active' : ''} onClick={() => setActiveTab(item)}>{item}</button>
          ))}
        </nav>
        <div className="sideFooter">
          <span className="pulseDot" /> System foundation online
          <small>Feature branch: feat/growth-os</small>
        </div>
      </aside>

      <main className="mainPanel">
        <header className="topbar">
          <div>
            <p className="eyebrow">AUTONOMOUS GROWTH CONTROL PLANE</p>
            <h1>{activeTab}</h1>
          </div>
          <div className="autonomyControl">
            <label>Autonomy</label>
            <select value={autonomy} onChange={(event) => setAutonomy(event.target.value)}>
              <option>Observe Only</option>
              <option>Guarded Autopilot</option>
              <option>Full Autopilot</option>
            </select>
          </div>
        </header>

        <section className="heroGrid">
          <article className="heroCard primaryCard">
            <div>
              <span className="statusPill">{autonomy}</span>
              <h2>Set the growth goal. Let the system do the work.</h2>
              <p>The engine continuously senses performance, finds opportunities, chooses actions, executes within guardrails, measures outcomes and feeds the result back into the next cycle.</p>
            </div>
            <div className="loop">
              {['Sense', 'Decide', 'Act', 'Measure', 'Learn'].map((step, index) => <span key={step}><b>{index + 1}</b>{step}</span>)}
            </div>
          </article>

          <article className="heroCard scoreCard">
            <ScoreRing value={overall} label="Growth readiness" />
            <div className="miniScores">
              <span><b>72</b>Local</span>
              <span><b>61</b>SEO</span>
              <span><b>68</b>Content</span>
              <span><b>54</b>Conversion</span>
            </div>
            <small>Baseline placeholders until live Google data is connected.</small>
          </article>
        </section>

        <section className="sectionBlock">
          <div className="sectionHead"><div><p className="eyebrow">AI WORKFORCE</p><h2>Autonomous agents</h2></div><span>{agents.length} agents</span></div>
          <div className="agentGrid">
            {agents.map((agent) => (
              <article className="agentCard" key={agent.name}>
                <div className="agentTop"><span className={`dot ${agent.status === 'Ready' ? 'green' : 'amber'}`} /><strong>{agent.name}</strong><em>{agent.mode}</em></div>
                <p>{agent.mission}</p>
                <footer><span>{agent.status}</span><button>Open</button></footer>
              </article>
            ))}
          </div>
        </section>

        <section className="twoCol">
          <article className="panel">
            <div className="sectionHead"><div><p className="eyebrow">PRIORITISED BY IMPACT</p><h2>Top opportunities</h2></div><button className="ghost">View all</button></div>
            <div className="opportunityList">
              {opportunities.map((item) => (
                <div className="opportunity" key={item.title}>
                  <div className="impactScore">{item.impact}</div>
                  <div><span>{item.channel} · {item.confidence}% confidence</span><h3>{item.title}</h3><p>{item.action}</p></div>
                  <button>Queue</button>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="sectionHead"><div><p className="eyebrow">DATA PLANE</p><h2>Connections</h2></div></div>
            <div className="connectorList">
              {connectors.map((item) => (
                <div className="connector" key={item.name}>
                  <div><strong>{item.name}</strong><span>{item.detail}</span></div>
                  <em className={item.state === 'Connected' || item.state === 'Available' ? 'ok' : ''}>{item.state}</em>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="twoCol lower">
          <article className="panel">
            <div className="sectionHead"><div><p className="eyebrow">EXECUTION LOG</p><h2>Automation timeline</h2></div></div>
            <div className="timeline">
              {activity.map((item) => <div key={item.text}><span className={item.type} /><time>{item.when}</time><p>{item.text}</p></div>)}
            </div>
          </article>
          <article className="panel guardrailPanel">
            <div className="sectionHead"><div><p className="eyebrow">NON-NEGOTIABLES</p><h2>Autonomy guardrails</h2></div></div>
            <ul>{guardrails.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>
      </main>
    </div>
  )
}

export default GrowthOS
