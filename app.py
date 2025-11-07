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
                run_accessibility_check(url)
                message = "Report generated successfully!"
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
                    generate_button,
                ],
                alignment=ft.alignment.center,
            ),
            alignment=ft.alignment.center,
        )
    )


ft.app(main)
