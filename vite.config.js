import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const productionRelease = {
  name: 'edelweizz-production-release',
  transformIndexHtml(html) {
    return html
      .replace('<meta name="robots" content="noindex, nofollow">', '<meta name="robots" content="index, follow">')
      .replace('<title>Edelweizz India | Every Child Blooms Uniquely</title>', '<title>Edelweizz Pediatric Therapy Center | Sarjapur, Bengaluru</title>')
      .replace(
        'content="Child-centred therapy and developmental support in Sarjapur, Bengaluru. Explore Edelweizz\'s services, our approach, and what to expect on your child\'s journey."',
        'content="Edelweizz Pediatric Therapy Center in Sarjapur, Bengaluru provides child-first speech therapy, occupational therapy, behaviour and ABA-informed support, special education, early intervention and developmental support."',
      )
      .replace('<a href="#services">Our services</a>', '<a href="/services/">Our services</a><a href="/parent-questions/">Parent questions</a>')
      .replace('href="#services">Explore our services', 'href="/services/">Explore our services')
  },
  transform(code, id) {
    if (!id.endsWith('/src/site.js')) return null
    return code
      .replace('About this private review site', 'About this website')
      .replace('This review site uses no added analytics or advertising trackers.', 'This website uses no added analytics or advertising trackers.')
  },
}

export default defineConfig({
  plugins: [react(), productionRelease],
})
