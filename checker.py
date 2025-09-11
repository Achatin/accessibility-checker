URLS = [
    "https://example.com",
]

# Run Playwright headless browser
# Inject axe-core
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
from axe_core_python.sync_playwright import Axe

axe = Axe()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False, slow_mo=1000)
    context = browser.new_context()

    page = context.new_page()
    page.goto(URLS[0])


    # Inject axe-core into the page
    results = axe.run(page)

    violations = results['violations']
    print(f"{len(violations)} violations found.")
    
    # Save results to json file
    json_file = Path("axe_results.json")
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    browser.close()

# Aggregate and rank issues

# Display results in html report

# (Optional) Save pdf file of results