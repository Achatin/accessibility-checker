import flet as ft
import threading
import requests
from urllib.parse import urlparse
from checker import run_accessibility_check
import datetime


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

    # Store previous scan results (temporary memory)
    history = []

    # Create table for history
    table = ft.DataTable(
        columns=[
            ft.DataColumn(ft.Text("Name")),
            ft.DataColumn(ft.Text("Date")),
            ft.DataColumn(ft.Text("Score")),
        ],
        rows=[],
    )

     # Function to update table content
    def update_table():
        table.rows.clear()
        for item in history:
            table.rows.append(
                ft.DataRow(
                    cells=[
                        ft.DataCell(ft.Text(item["url"])),
                        ft.DataCell(ft.Text(item["date"])),
                        ft.DataCell(ft.Text(str(item["score"]))),
                    ]
                )
            )
        page.update()




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
                formats = []
                html_selected = checkbox_html.value  
                pdf_selected = checkbox_pdf.value

                if not checkbox_html.value and not checkbox_pdf.value:
                   raise Exception("Please select at least one report type (HTML or PDF).")

                if html_selected:
                    formats.append("html")
                if pdf_selected:
                    formats.append("pdf")
                  
                run_accessibility_check(url, formats)

                # Store result in the table
                now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                # Temporary score (you can replace this with actual data)
                score = "Pending"
                history.append({"url": url, "date": now, "score": score})
                update_table()

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
                     ft.Divider(),
ft.Container(
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
    width=600,
    bgcolor=ft.Colors.WHITE,
    shadow=ft.BoxShadow(
        spread_radius=1,
        blur_radius=8,
        offset=ft.Offset(0, 2),
    ),
),


                ],
                alignment=ft.MainAxisAlignment.CENTER,         
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,  
            ),
            alignment=ft.alignment.center,
             padding=20,
        )
    )


ft.app(main)
