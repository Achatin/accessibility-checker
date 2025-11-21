import flet as ft
from pathlib import Path
import threading
import requests
from urllib.parse import urlparse
import webbrowser
from datetime import datetime

from checker import run_accessibility_check
from db import init_db, add_report, load_reports


# -------------------------------
# Utility Functions
# -------------------------------

def open_report(item, page: ft.Page):
    """Open report file in browser or show error message."""
    file_path = Path(item["file_path"])
    if file_path.exists():
        webbrowser.open(file_path.resolve().as_uri())
    else:
        show_snackbar(page, "File not found!")


def show_snackbar(page: ft.Page, message: str):
    """Display a snackbar message."""
    page.open(ft.SnackBar(ft.Text(message)))


def is_valid_url(url: str) -> bool:
    """Return True if URL has valid scheme and netloc."""
    try:
        parsed = urlparse(url)
        return parsed.scheme in ("http", "https") and bool(parsed.netloc)
    except Exception:
        return False


def is_reachable_url(url: str) -> bool:
    """Check if URL is reachable via HTTP HEAD request."""
    try:
        resp = requests.head(url, allow_redirects=True, timeout=5)
        return resp.status_code < 400
    except Exception:
        return False


def get_latest_report_file(fmt: str) -> Path:
    """Find the latest generated report file based on format."""
    report_dir = Path("reports")
    if fmt == "html":
        return max(report_dir.glob("report_*.html"), key=lambda p: p.stat().st_mtime)
    elif fmt == "pdf":
        return max(report_dir.glob("report_*.pdf"), key=lambda p: p.stat().st_mtime)
    else:
        raise ValueError(f"Unknown format: {fmt}")


def format_time_ago(date_str: str) -> str:
    """Convert date string to relative time."""
    try:
        dt = datetime.fromisoformat(date_str)
        diff = datetime.now() - dt
        if diff.days > 0:
            return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
        elif diff.seconds < 60:
            return "just now"
        elif diff.seconds < 3600:
            mins = diff.seconds // 60
            return f"{mins} minute{'s' if mins > 1 else ''} ago"
        else:
            hrs = diff.seconds // 3600
            return f"{hrs} hour{'s' if hrs > 1 else ''} ago"
    except:
        return date_str


# -------------------------------
# UI Logic
# -------------------------------

def main(page: ft.Page):
    init_db()
    reports = load_reports()

    # --- Page Configuration ---
    page.title = "FeamsCheck"
    page.bgcolor = "#F5F5F5"
    page.padding = 0
    page.theme_mode = ft.ThemeMode.LIGHT

    # --- Header ---
    header = ft.Container(
        content=ft.Row(
            [
                ft.Container(
                    content=ft.Image(src="logo.png", width=50, height=50, fit=ft.ImageFit.CONTAIN),
                    padding=6,
                ),
                ft.Column(
                    [
                        ft.Text("FeamsCheck", size=20, weight=ft.FontWeight.BOLD, color="#1A1A2E"),
                        ft.Text("Audit your website for WCAG compliance", size=13, color="#6B7280"),
                    ],
                    spacing=2,
                ),
            ],
            spacing=15,
        ),
        padding=ft.padding.symmetric(horizontal=40, vertical=20),
        bgcolor=ft.Colors.WHITE,
        border=ft.border.only(bottom=ft.BorderSide(1, "#E5E7EB")),
    )

    # --- URL Input ---
    txt_url = ft.TextField(
        hint_text="https://example.com",
        border=ft.InputBorder.OUTLINE,
        border_color="#E5E7EB",
        focused_border_color="#3B5BDB",
        border_radius=8,
        content_padding=ft.padding.symmetric(horizontal=16, vertical=14),
        text_size=14,
        expand=True,
    )

    # --- Report Format Radio Buttons ---
    format_group = ft.RadioGroup(
        value="html",
        content=ft.Row(
            [
                ft.Radio(value="html", label="HTML"),
                ft.Radio(value="pdf", label="PDF"),
            ],
            spacing=20,
        ),
    )

    # --- Generate Button ---
    btn_text = ft.Text("Generate Report", color=ft.Colors.WHITE, size=14, weight=ft.FontWeight.W_500)
    btn_content = ft.Row([btn_text], alignment=ft.MainAxisAlignment.CENTER)
    
    generate_button = ft.Container(
        content=btn_content,
        bgcolor="#322B7E",
        border_radius=8,
        padding=ft.padding.symmetric(vertical=14),
        ink=True,
        on_click=lambda e: None,  # Placeholder, set below
    )

    # --- Report History List ---
    history_column = ft.Column(spacing=10, scroll=ft.ScrollMode.AUTO)

    def create_report_card(item):
        """Create a card for each report in history."""
        violations = item['total_violations']
        return ft.Container(
            content=ft.Row(
                [
                    ft.Column(
                        [
                            ft.Text(item["url"], size=16, weight=ft.FontWeight.W_500, color="#1A1A2E"),
                            ft.Row(
                                [
                                    ft.Text(item["format"].upper(), size=12, color="#6B7280"),
                                    ft.Text("•", size=12, color="#D1D5DB"),
                                    ft.Text(format_time_ago(item["date"]), size=12, color="#9CA3AF"),
                                ],
                                spacing=8,
                            ),
                        ],
                        spacing=4,
                        expand=True,
                    ),
                    ft.Column(
                        [
                            ft.Container(
                                content=ft.Text(str(violations), size=14, weight=ft.FontWeight.BOLD, color="#FFFFFF"),
                                bgcolor="#6B7280",
                                border_radius=6,
                                padding=ft.padding.symmetric(horizontal=12, vertical=6),
                            ),
                            ft.Text("violations", size=12, color="#9CA3AF"),
                        ],
                        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                        spacing=4,
                    ),
                ],
                alignment=ft.MainAxisAlignment.SPACE_BETWEEN,
                vertical_alignment=ft.CrossAxisAlignment.CENTER,
            ),
            padding=16,
            border=ft.border.all(1, "#E5E7EB"),
            border_radius=10,
            bgcolor=ft.Colors.WHITE,
            on_click=lambda e, item=item: open_report(item, page),
            ink=True,
        )

    def update_history():
        """Refresh history list from current report list."""
        history_column.controls.clear()
        for item in reports:
            history_column.controls.append(create_report_card(item))
        page.update()

    update_history()

    # --- Main Input Card ---
    input_card = ft.Container(
        content=ft.Column(
            [
                ft.Text("Website URL", size=14, weight=ft.FontWeight.W_500, color="#374151"),
                txt_url,
                ft.Text("Enter the full URL you want to check, including the protocol", size=12, color="#9CA3AF"),
                ft.Container(height=10),
                ft.Text("Report Format", size=14, weight=ft.FontWeight.W_500, color="#374151"),
                format_group,
                ft.Container(height=10),
                generate_button,
            ],
            spacing=8,
        ),
        padding=30,
        border=ft.border.all(1, "#E5E7EB"),
        border_radius=12,
        bgcolor=ft.Colors.WHITE,
        width=800,
    )

    # --- History Card ---
    history_card = ft.Container(
        content=ft.Column(
            [
                ft.Text("Report History", size=16, weight=ft.FontWeight.BOLD, color="#1A1A2E"),
                ft.Container(height=5),
                history_column,
            ],
            spacing=5,
        ),
        padding=20,
        border=ft.border.all(1, "#E5E7EB"),
        border_radius=12,
        bgcolor=ft.Colors.WHITE,
        width=800,
    )

    # --- Main Button Logic ---
    def run_check(e):
        url = txt_url.value.strip()

        if not url:
            return show_snackbar(page, "Please enter a URL!")
        if not is_valid_url(url):
            return show_snackbar(page, "Invalid URL format! Please include http:// or https://")
        if not is_reachable_url(url):
            return show_snackbar(page, "This URL could not be reached!")

        # Disable button & show loading
        btn_text.value = "Generating..."
        generate_button.bgcolor = "#6B7CDB"
        generate_button.disabled = True
        page.update()

        def background_task():
            try:
                fmt = format_group.value
                results = run_accessibility_check(url, [fmt])
                file_path = get_latest_report_file(fmt)
                add_report(url, len(results["violations"]), fmt, file_path)
                reports[:] = load_reports()
                update_history()
                show_snackbar(page, "Report generated successfully!")
            except Exception as ex:
                show_snackbar(page, f"Error: {ex}")
            finally:
                btn_text.value = "Generate Report"
                generate_button.bgcolor = "#322B7E"
                generate_button.disabled = False
                page.update()

        threading.Thread(target=background_task, daemon=True).start()

    generate_button.on_click = run_check
    
    # --- Promotion Banner ---
    def close_promo(e):
        promo_banner.visible = False
        page.update()

    promo_banner = ft.Container(
        content=ft.Row(
            [
                ft.Icon(ft.Icons.CAMPAIGN, color="#322B7E", size=18),
                ft.Text("Visit our website for more accessibility support and resources!", size=13, color="#374151"),
                ft.TextButton(
                    "Visit Website",
                    url="https://example.com",
                    style=ft.ButtonStyle(color="#322B7E"),
                ),
                ft.IconButton(
                    icon=ft.Icons.CLOSE,
                    icon_color="#9CA3AF",
                    icon_size=16,
                    on_click=close_promo,
                    tooltip="Dismiss",
                ),
            ],
            alignment=ft.MainAxisAlignment.CENTER,
            vertical_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=10,
        ),
        bgcolor="#F3E8FF",
        border_radius=8,
        padding=ft.padding.symmetric(horizontal=20, vertical=10),
        width=800,
    )

    # --- Main Content Layout ---
    content = ft.Container(
        content=ft.Column(
            [promo_banner, input_card, history_card],
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=20,
            scroll=ft.ScrollMode.AUTO,
        ),
        alignment=ft.alignment.top_center,
        padding=30,
        expand=True,
    )

    # --- Page Layout ---
    page.add(
        ft.Column(
            [header, content],
            spacing=0,
            expand=True,
        )
    )


# -------------------------------
# App Entry
# -------------------------------

ft.app(main)