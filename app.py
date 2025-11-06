from ctypes import alignment
import flet as ft

from checker import run_checker

def main(page: ft.Page):
    page.title = "Digital Accessibility Checker"
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    
    # Force light mode
    page.theme_mode = ft.ThemeMode.LIGHT

    txt_number = ft.TextField(label="URL", hint_text="Enter URL...", width=500)
    
    generate_button = ft.TextButton("Generate Report", icon=ft.Icons.FILE_OPEN, on_click=lambda e: run_checker(txt_number.value))

    page.add(
        ft.Container(
            content=ft.Column(
                [
                    txt_number,
                    generate_button,
                ],
                alignment=ft.alignment.center,
            ),
            alignment=ft.alignment.center,
        )
    )

ft.app(main)