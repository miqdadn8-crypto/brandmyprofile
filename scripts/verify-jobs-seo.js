// Asserts the Jobs section is noindex,follow with no canonical / JobPosting in the raw
// generated HTML, absent from the sitemap, and that indexable pages are unaffected.
// Run after `npm run build`: node scripts/verify-jobs-seo.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../dist');
let failures = 0;
const check = (ok, msg) => { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`); };
const read = (p) => fs.readFileSync(path.join(dist, p, 'index.html'), 'utf8');

const noindexRoutes = ['/kuwait/jobs', '/uae/jobs', '/saudi/jobs', '/qatar/jobs', '/india/jobs',
  '/jobs/kuwait/kw-004', '/kuwait/jobs/kw-004', '/jobs/uae/uae-001', '/uae/jobs/uae-001'];
for (const r of noindexRoutes) {
  const h = read(r);
  const robots = (h.match(/<meta name="robots" content="([^"]*)"/g) || []);
  check(robots.length === 1 && /noindex,follow/.test(robots[0]), `${r}: single robots meta = noindex,follow`);
  check(!/rel="canonical"/.test(h), `${r}: no canonical`);
  check(!/JobPosting|aggregateRating|AggregateRating|"Review"|application\/ld\+json/.test(h), `${r}: no JobPosting/AggregateRating/Review/JSON-LD`);
}
for (const r of ['/bahrain/jobs', '/oman/jobs']) {
  const h = read('/') ; // unsupported routes get no bespoke shell
  check(!fs.existsSync(path.join(dist, r, 'index.html')), `${r}: no static shell generated`);
}
const cv = read('/kuwait/services/cv-writing');
check(/<meta name="robots" content="index, follow"|^(?!.*noindex)/s.test(cv) && !/noindex/.test(cv), '/kuwait/services/cv-writing: indexable');
check(cv.includes('<link rel="canonical" href="https://www.brandmyprofile.com/kuwait/services/cv-writing"'), '/kuwait/services/cv-writing: www canonical');

const sm = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
check(!/\/jobs(\/|<)/.test(sm), 'sitemap: no /jobs listing or job-detail URLs');
const rb = fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8');
check(!/jobs/i.test(rb), 'robots.txt: does not block jobs');
console.log(failures ? `\n${failures} FAILED` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
