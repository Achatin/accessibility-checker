import flet as ft
from pathlib import Path
import threading
import requests
from urllib.parse import urlparse
import webbrowser

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


# -------------------------------
# UI Logic
# -------------------------------

def main(page: ft.Page):
    init_db()
    reports = load_reports()

    # --- Page Configuration ---
    page.title = "Digital Accessibility Checker"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.theme_mode = ft.ThemeMode.LIGHT

    # --- UI Components ---
    def clear_url(e):
        txt_url.value = ""
        txt_url.suffix = None
        page.update()

    def on_url_change(e):
        if txt_url.value.strip():
            txt_url.suffix = ft.IconButton(
                icon=ft.Icons.CLOSE,
                icon_color=ft.Colors.GREY_600,
                icon_size=18,
                padding=2,
                width=20,
                height=20,
                tooltip="Clear",
                on_click=clear_url,
            )
        else:
            txt_url.suffix = None
        page.update()

    txt_url = ft.TextField(
        label="URL",
        hint_text="Enter URL...",
        width=500,
        on_change=on_url_change,
    )
    
    checkbox_html = ft.Checkbox(label="HTML")
    checkbox_pdf = ft.Checkbox(label="PDF")

    generate_button = ft.TextButton("Generate Report", icon=ft.Icons.FILE_OPEN)

    # Data table for reports
    table = ft.DataTable(
        columns=[
            ft.DataColumn(ft.Text("URL")),
            ft.DataColumn(ft.Text("Date")),
            ft.DataColumn(ft.Text("Format")),
            ft.DataColumn(ft.Text("Total Violations")),
        ],
        rows=[],
    )

    # --- Table Handling ---
    def update_table():
        """Refresh table rows from current report list."""
        table.rows.clear()
        for item in reports:
            table.rows.append(
                ft.DataRow(
                    cells=[
                        ft.DataCell(ft.Text(item["url"])),
                        ft.DataCell(ft.Text(item["date"])),
                        ft.DataCell(ft.Text(item["format"])),
                        ft.DataCell(ft.Text(str(item["total_violations"]))),
                    ],
                    on_select_changed=lambda e, item=item: open_report(item, page),
                )
            )
        page.update()

    update_table()

    # --- Main Button Logic ---
    def run_check(e):
        url = txt_url.value.strip()

        # Validate URL
        if not url:
            return show_snackbar(page, "Please enter a URL!")
        if not is_valid_url(url):
            return show_snackbar(page, "Invalid URL format! Please include http:// or https://")
        if not is_reachable_url(url):
            return show_snackbar(page, "This URL could not be reached!")

        # Disable button & show spinner
        set_button_state(generate_button, "Generating...", ft.Icons.HOURGLASS_TOP, True)
        page.update()

        def background_task():
            try:
                # Collect selected formats
                formats = [fmt for fmt, chk in (("html", checkbox_html), ("pdf", checkbox_pdf)) if chk.value]
                if not formats:
                    raise ValueError("Please select at least one report type (HTML or PDF).")

                # Run the accessibility checker
                results = run_accessibility_check(url, formats)

                # Record generated reports in database
                for fmt in formats:
                    file_path = get_latest_report_file(fmt)
                    add_report(url, len(results["violations"]), fmt, file_path)

                reports[:] = load_reports()
                update_table()
                show_snackbar(page, "Report(s) generated successfully!")

            except Exception as ex:
                show_snackbar(page, f"Error: {ex}")

            finally:
                set_button_state(generate_button, "Generate Report", ft.Icons.FILE_OPEN, False)
                page.update()

        threading.Thread(target=background_task, daemon=True).start()

    generate_button.on_click = run_check
    

    # --- Layout ---
    page.add(
        ft.Container(
            content=ft.Column(
                [
                    txt_url,
                    ft.Row([checkbox_html, checkbox_pdf], alignment=ft.MainAxisAlignment.CENTER),
                    generate_button,
                    ft.Divider(),
                    create_reports_section(table),
                ],
                alignment=ft.MainAxisAlignment.CENTER,
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            ),
            alignment=ft.alignment.center,
                padding=20,
            )
    )


def set_button_state(button: ft.TextButton, text: str, icon, disabled: bool):
    """Update button state and appearance."""
    button.text = text
    button.icon = icon
    button.disabled = disabled


def create_reports_section(table: ft.DataTable) -> ft.Container:
    """Return a styled container with the reports table."""
    return ft.Container(
        content=ft.Column(
            [
                ft.Text("Previous Reports", size=18, weight=ft.FontWeight.BOLD),
                table,
            ],
            alignment=ft.MainAxisAlignment.START,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=10,
        ),
        border=ft.border.all(1, ft.Colors.GREY_400),
        border_radius=10,
        padding=20,
        margin=20,
        width=700,
        bgcolor=ft.Colors.WHITE,
        shadow=ft.BoxShadow(spread_radius=1, blur_radius=8, offset=ft.Offset(0, 2)),
    )


# -------------------------------
# App Entry
# -------------------------------

ft.app(main)
