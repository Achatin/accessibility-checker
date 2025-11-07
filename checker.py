from pathlib import Path
import json
import datetime
from zoneinfo import ZoneInfo
from urllib.parse import urlparse
import requests
from robotexclusionrulesparser import RobotExclusionRulesParser
from playwright.sync_api import sync_playwright
from axe_core_python.sync_playwright import Axe
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML

URLS = [
    "https://www.sdu.dk/",
]

# ----------------------------- #
# Robots.txt Utilities
# ----------------------------- #
def check_robots_txt(url: str) -> bool:
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    resp = requests.get(robots_url)
    rp = RobotExclusionRulesParser()
    rp.parse(resp.text)
    return rp.is_allowed("*", url)


def check_crawl_delay(url: str) -> int:
    parsed = urlparse(url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    resp = requests.get(robots_url)
    rp = RobotExclusionRulesParser()
    rp.parse(resp.text)
    delay = rp.get_crawl_delay("*")
    return delay or 0


# ----------------------------- #
# Accessibility & Reporting
# ----------------------------- #
def run_axe_analysis(url: str, results_file: str = "axe_results.json") -> dict:
    axe = Axe()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        page.goto(url)

        results = axe.run(page)
        browser.close()

    with open(results_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    return results


def load_results(results_file: str) -> dict:
    with open(results_file, "r", encoding="utf-8") as f:
        return json.load(f)


def process_violations(violations: list) -> list:
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
    return violations


def render_html_report(url: str, results: dict, template_file: str = "template.html") -> str:
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template(template_file)

    violations = process_violations(results['violations'])
    passes = results['passes']
    incomplete = results['incomplete']

    output = template.render(
        url=url,
        generated_at=datetime.datetime.now(ZoneInfo("Europe/Paris")),
        violations=violations,
        passes=passes,
        incomplete=incomplete
    )

    with open("report.html", "w", encoding="utf-8") as f:
        f.write(output)

    return output


def generate_pdf(url: str, results: dict, template_file: str = "templates/pdf-template.html"):
    env = Environment(loader=FileSystemLoader("."))
    template = env.get_template(template_file)

    violations_data = results.get('violations', [])
    passes_data = results.get('passes', [])
    incomplete_data = results.get('incomplete', [])

    html_out = template.render(
        url=url,
        generated_at=datetime.datetime.now(),
        violations=violations_data,
        passes=passes_data,
        incomplete=incomplete_data
    )

    HTML(string=html_out).write_pdf("report.pdf")


# ----------------------------- #
# Main Workflow
# ----------------------------- #
def run_accessibility_check(url: str):
    print(f"Checking robots.txt permissions for {url}...")
    if not check_robots_txt(url):
        print(f"Scraping disallowed by robots.txt: {url}")
        exit(1)

    delay = check_crawl_delay(url)
    print(f"Crawl-delay: {delay} seconds")

    results = run_axe_analysis(url)
    print(f"{len(results['violations'])} violations found.")

    html_output = render_html_report(url, results)
    print("Report generated: report.html")

    generate_pdf(url, results)
    print("PDF report generated: report.pdf")


# ----------------------------- #
# Entrypoint
# ----------------------------- #
if __name__ == "__main__":
    run_accessibility_check(URLS[0])
