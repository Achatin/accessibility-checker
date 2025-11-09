import flet as ft
import threading
import requests
from urllib.parse import urlparse
from checker import run_accessibility_check


def is_valid_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return all([parsed.scheme in ("http", "https"), parsed.netloc])
    except Exception:
        return False


def is_reachable_url(url: str) -> bool:
    try:
        resp = requests.head(url, allow_redirects=True, timeout=5)
        return resp.status_code < 400
    except Exception:
        return False


def main(page: ft.Page):
    page.title = "Digital Accessibility Checker"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.theme_mode = ft.ThemeMode.LIGHT

    txt_url = ft.TextField(label="URL", hint_text="Enter URL...", width=500)
    
    generate_button = ft.TextButton(
        "Generate Report",
        icon=ft.Icons.FILE_OPEN,
    )

    checkbox_html = ft.Checkbox(label="HTML", value=False)
    checkbox_pdf = ft.Checkbox(label="PDF", value=False)

    def run_check(e):
        url = txt_url.value.strip()

        if not url:
            page.open(ft.SnackBar(ft.Text("Please enter a URL!")))
            return

        if not is_valid_url(url):
            page.open(ft.SnackBar(ft.Text("Invalid URL format! Please include http:// or https://")))
            return

        if not is_reachable_url(url):
            page.open(ft.SnackBar(ft.Text("This URL could not be reached!")))
            return

        # Change icon to spinner and disable button
        generate_button.icon = ft.Icons.HOURGLASS_TOP
        generate_button.text = "Generating..."
        generate_button.disabled = True
        page.update()

        def task():
            try:
                #we verify what checkbox is selected
                html_selected = checkbox_html.value  
                pdf_selected = checkbox_pdf.value

                if not checkbox_html.value and not checkbox_pdf.value:
                   raise Exception("Please select at least one report type (HTML or PDF).")

                from checker import run_axe_analysis, render_html_report, generate_pdf

                results = run_axe_analysis(url)

                #we generate only the selected report type
                if html_selected:
                  render_html_report(url, results)
                if pdf_selected:
                  generate_pdf(url, results)

                message = "Report(s) generated successfully!"
            except Exception as ex:
                message = f"Error: {ex}"
            finally:
                # Switch icon back when done
                generate_button.icon = ft.Icons.FILE_OPEN
                generate_button.text = "Generate Report"
                generate_button.disabled = False
                page.open(ft.SnackBar(ft.Text(message)))
                page.update()

        threading.Thread(target=task, daemon=True).start()

    generate_button.on_click = run_check

    page.add(
        ft.Container(
            content=ft.Column(
                [
                    txt_url,
                    ft.Row([checkbox_html, checkbox_pdf],
                           alignment=ft.MainAxisAlignment.CENTER),
                    generate_button,
                ],
                alignment=ft.MainAxisAlignment.CENTER,         
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,  
            ),
            alignment=ft.alignment.center,
        )
    )


ft.app(main)
