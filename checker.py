URLS = [
    "https://www.sdu.dk/",
]

# Run Playwright headless browser
# Inject axe-core
from binascii import Incomplete
import json
from pathlib import Path
from tempfile import template
from playwright.sync_api import sync_playwright
from axe_core_python.sync_playwright import Axe
import datetime
from zoneinfo import ZoneInfo
from urllib.parse import urlparse
import requests
from robotexclusionrulesparser import RobotExclusionRulesParser

def check_robots_txt(url):
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"

    resp = requests.get(robots_url)

    rp = RobotExclusionRulesParser()
    rp.parse(resp.text)    
    
    return rp.is_allowed("*", url)


axe = Axe()

results_file = "axe_results.json"

# True = allowed, False = disallowed
result = check_robots_txt(URLS[0])
print(result)

if result is False:
    print(f"Scraping disallowed by robots.txt: {URLS[0]}")
    exit(1)

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
    
# get violations & passes
violations = results['violations']
passes = results['passes']
incomplete = results['incomplete']

# Aggregate and rank issues ---> severity x frequency
for v in violations:
    v['impact'] = v.get('impact', 'unknown')
    v['num_nodes'] = len(v.get('nodes', []))
    impact_rank = {
        'critical': 4,
        'serious': 3,
        'moderate': 2,
        'minor': 1,
    }
    v['severity_score'] = impact_rank.get(v['impact'], 1) * v['num_nodes']

violations.sort(key=lambda x: x['severity_score'], reverse=True)

# setup jinja environment
from jinja2 import Environment, FileSystemLoader
env = Environment(loader=FileSystemLoader('.'))
template = env.get_template('template.html')


# render/create html report
output = template.render(
    url=URLS[0],
    generated_at=datetime.datetime.now(ZoneInfo("Europe/Paris")),
    violations=violations,
    passes=passes,
    incomplete=incomplete
)

# save it to file: report.html
with open("report.html", "w", encoding="utf-8") as f:
    f.write(output)

print("Report generated: report.html")




# (Optional) Save pdf file of results