const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'weaponDatabase.js');
const weapons = require(dbPath);

// Canonical/known warbond slugs (allow 'free' alias used in DB)
const canonicalWarbonds = new Set([
  'free','helldivers-mobilize','steeled-veterans','cutting-edge','democratic-detonation',
  'polar-patriots','viper-commandos','freedom-flame','chemical-agents','truth-enforcers',
  'urban-legends','servants-freedom','borderline-justice','masters-ceremony','force-of-law',
  'control-group','odst','dust-devils'
]);

function normalizeName(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]/g, '');
}

const report = {
  totalItems: 0,
  invalidWarbonds: [],
  duplicates: [],
  crossCategoryDuplicates: [],
  placeholders: [],
  defaultGrantedCandidates: [],
  primariesMissingType: [],
  itemsByCategoryCount: {}
};

const seen = new Map(); // key -> {count, examples}
const nameToCategories = new Map();

Object.keys(weapons).forEach(category => {
  const arr = weapons[category] || [];
  report.itemsByCategoryCount[category] = arr.length;
  arr.forEach(item => {
    report.totalItems += 1;
    const warbond = item.warbond || 'UNKNOWN';
    const name = item.name || '(no-name)';

    // invalid warbond
    if (!canonicalWarbonds.has(warbond)) {
      report.invalidWarbonds.push({ category, name, warbond });
    }

    // primary missing type
    if (category === 'primary' && !item.type) {
      report.primariesMissingType.push({ name, warbond });
    }

    // duplicates detection (within same category + warbond)
    const key = `${normalizeName(name)}|${category}|${warbond}`;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push({ name, category, warbond });

    // cross-category mapping by normalized name
    const norm = normalizeName(name);
    if (!nameToCategories.has(norm)) nameToCategories.set(norm, new Set());
    nameToCategories.get(norm).add(category);

    // placeholders
    if (/placeholder/i.test(name) || ['control-group','dust-devils'].includes(warbond)) {
      report.placeholders.push({ category, name, warbond });
    }

    // default-granted stratagems candidates
    if (category === 'stratagem') {
      if (/^resupply$/i.test(name) || /^reinforce$/i.test(name) || /^hellbomb$/i.test(name)) {
        report.defaultGrantedCandidates.push({ name, category, warbond });
      }
    }
  });
});

// collect duplicates
for (const [key, items] of seen.entries()) {
  if (items.length > 1) {
    report.duplicates.push({ key, count: items.length, examples: items.slice(0,5) });
  }
}

// cross-category duplicates (same normalized name across multiple categories)
for (const [norm, categories] of nameToCategories.entries()) {
  if (categories.size > 1) {
    report.crossCategoryDuplicates.push({ nameNorm: norm, categories: Array.from(categories) });
  }
}

// Write report
const outDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outPath = path.join(outDir, 'weapon-audit.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');

// Console summary
console.log('Weapon database audit complete.');
console.log(`Total items scanned: ${report.totalItems}`);
console.log(`Invalid warbonds: ${report.invalidWarbonds.length}`);
console.log(`Duplicates (same name+category+warbond): ${report.duplicates.length}`);
console.log(`Cross-category duplicates: ${report.crossCategoryDuplicates.length}`);
console.log(`Placeholders detected: ${report.placeholders.length}`);
console.log(`Default-granted stratagem candidates: ${report.defaultGrantedCandidates.length}`);
console.log(`Primaries missing type: ${report.primariesMissingType.length}`);
console.log(`Full JSON report written to: ${outPath}`);

// Exit with non-zero if critical issues found (duplicates or invalid warbonds)
if (report.invalidWarbonds.length > 0 || report.duplicates.length > 0 || report.crossCategoryDuplicates.length > 0) {
  process.exitCode = 2;
}
