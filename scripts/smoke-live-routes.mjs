const routes = [
  '/',
  '/skills/grammar-hex/adaptive-lab',
  '/ielts/exam/c18-acad-t1',
  '/teacher/analytics',
  '/admin',
  '/api/health'
];

async function checkRoutes() {
  console.log('Testing live Next.js routes on http://localhost:3000 ...\n');
  let allOk = true;
  for (const route of routes) {
    try {
      const res = await fetch('http://localhost:3000' + route, { redirect: 'manual' });
      const text = await res.text();
      const statusOk = res.status >= 200 && res.status < 400;
      const statusIcon = statusOk ? '✓' : '✗';
      console.log(`  ${statusIcon} [HTTP ${res.status}] ${route} (${text.length} bytes)`);
      if (!statusOk) {
        allOk = false;
      }
    } catch (err) {
      console.error(`  ✗ [FAIL] ${route}: ${err.message}`);
      allOk = false;
    }
  }
  if (allOk) {
    console.log('\n✅ All live routes verified with successful HTTP responses!');
    process.exit(0);
  } else {
    console.error('\n❌ Some routes failed!');
    process.exit(1);
  }
}

checkRoutes();
