import re
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = ROOT / 'weaponDatabase.js'
OUT_DIR = ROOT / 'reports'
OUT_DIR.mkdir(exist_ok=True)
OUT_PATH = OUT_DIR / 'weapon-audit.json'

with open(DB_PATH, 'r', encoding='utf8') as f:
    src = f.read()

def find_array_block(src, key):
    # find the start of '<key>:' then the following '[' and return the content until matching ']'
    m = re.search(rf"\b{key}\s*:\s*\[", src)
    if not m:
        return None
    i = m.end()  # position after '['
    depth = 1
    start = i
    while i < len(src):
        c = src[i]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return src[start:i]
        i += 1
    return None

def extract_objects(array_text):
    objs = []
    i = 0
    while i < len(array_text):
        # find next '{'
        m = re.search(r"\{", array_text[i:])
        if not m:
            break
        j = i + m.start()
        depth = 0
        k = j
        while k < len(array_text):
            if array_text[k] == '{':
                depth += 1
            elif array_text[k] == '}':
                depth -= 1
                if depth == 0:
                    objs.append(array_text[j:k+1])
                    i = k+1
                    break
            k += 1
        else:
            break
    return objs

def normalize_name(name):
    return re.sub(r'[^a-z0-9]', '', name.lower())

canonical_warbonds = set([
  'free','helldivers-mobilize','steeled-veterans','cutting-edge','democratic-detonation',
  'polar-patriots','viper-commandos','freedom-flame','chemical-agents','truth-enforcers',
  'urban-legends','servants-freedom','borderline-justice','masters-ceremony','force-of-law',
  'control-group','odst','dust-devils'
])

report = {
  'totalItems': 0,
  'invalidWarbonds': [],
  'duplicates': [],
  'crossCategoryDuplicates': [],
  'placeholders': [],
  'defaultGrantedCandidates': [],
  'primariesMissingType': [],
  'itemsByCategoryCount': {}
}

seen = {}
name_to_categories = {}

for category in ('primary','secondary','grenade','stratagem'):
    block = find_array_block(src, category)
    if block is None:
        report['itemsByCategoryCount'][category] = 0
        continue
    objs = extract_objects(block)
    report['itemsByCategoryCount'][category] = len(objs)
    for obj in objs:
        # extract name, warbond, type
        name_m = re.search(r"name:\s*\"([^\"]+)\"|name:\s*'([^']+)'", obj)
        name = (name_m.group(1) or name_m.group(2)) if name_m else '(no-name)'
        warbond_m = re.search(r"warbond:\s*\"([^\"]+)\"|warbond:\s*'([^']+)'", obj)
        warbond = (warbond_m.group(1) or warbond_m.group(2)) if warbond_m else 'UNKNOWN'
        type_m = re.search(r"type:\s*\"([^\"]+)\"|type:\s*'([^']+)'", obj)
        typ = (type_m.group(1) or type_m.group(2)) if type_m else None

        report['totalItems'] += 1

        if warbond not in canonical_warbonds:
            report['invalidWarbonds'].append({'category': category, 'name': name, 'warbond': warbond})

        if category == 'primary' and not typ:
            report['primariesMissingType'].append({'name': name, 'warbond': warbond})

        key = f"{normalize_name(name)}|{category}|{warbond}"
        seen.setdefault(key, []).append({'name': name, 'category': category, 'warbond': warbond})

        norm = normalize_name(name)
        name_to_categories.setdefault(norm, set()).add(category)

        # Only mark explicit placeholder items by name. Previously we treated
        # entire warbonds like 'control-group' and 'dust-devils' as placeholders
        # during early data-entry; now the data file contains real entries and
        # we should only flag items that explicitly contain 'placeholder'.
        if re.search(r'placeholder', name, re.I):
            report['placeholders'].append({'category': category, 'name': name, 'warbond': warbond})

        if category == 'stratagem' and re.match(r'^(resupply|reinforce|hellbomb)$', name, re.I):
            report['defaultGrantedCandidates'].append({'name': name, 'category': category, 'warbond': warbond})

for k, v in seen.items():
    if len(v) > 1:
        report['duplicates'].append({'key': k, 'count': len(v), 'examples': v[:5]})

for norm, cats in name_to_categories.items():
    if len(cats) > 1:
        report['crossCategoryDuplicates'].append({'nameNorm': norm, 'categories': list(cats)})

with open(OUT_PATH, 'w', encoding='utf8') as f:
    json.dump(report, f, indent=2)

print('Weapon database audit complete.')
print('Total items scanned:', report['totalItems'])
print('Invalid warbonds:', len(report['invalidWarbonds']))
print('Duplicates:', len(report['duplicates']))
print('Cross-category duplicates:', len(report['crossCategoryDuplicates']))
print('Placeholders detected:', len(report['placeholders']))
print('Default-granted stratagem candidates:', len(report['defaultGrantedCandidates']))
print('Primaries missing type:', len(report['primariesMissingType']))
print('Full JSON report written to:', OUT_PATH)

exit_code = 2 if (report['invalidWarbonds'] or report['duplicates'] or report['crossCategoryDuplicates']) else 0
raise SystemExit(exit_code)
