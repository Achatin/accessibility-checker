URLS = [
    "https://ace.ucv.ro/",
]

# Run Playwright headless browser
# Inject axe-core
import json
from pathlib import Path
from tempfile import template
from playwright.sync_api import sync_playwright
from axe_core_python.sync_playwright import Axe

axe = Axe()

results_file = "axe_results.json"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()

    page = context.new_page()
    page.goto(URLS[0])


    # Inject axe-core into the page
    results = axe.run(page)

    violations = results['violations']
    print(f"{len(violations)} violations found.")
    
    # Save results to json file
    json_file = Path(results_file)
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    browser.close()


# Display results in html report

# load/read results from axe_results.json
with open(results_file, "r", encoding="utf-8") as f:
    results = json.load(f)
    
# get violations
violations = results['violations']


# Aggregate and rank issues ---> severity x frequency
for v in violations:
    v['impact'] = v.get('impact', 'unknown')
    v['num_nodes'] = len(v.get('nodes', []))
    impact_rank = {
        'critical': 5,
        'serious': 4,
        'moderate': 3,
        'minor': 2,
        'unknown': 1
    }
    v['severity_score'] = impact_rank.get(v['impact'], 1) * v['num_nodes']

violations.sort(key=lambda x: x['severity_score'], reverse=True)

# setup jinja environment
from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template.html')

# render/create html report
output = template.render(violations=violations)

# save it to file: report.html
with open("report.html", "w", encoding="utf-8") as f:
    f.write(output)

print("Report generated: report.html")




# (Optional) Save pdf file of results