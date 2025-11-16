"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Download, Loader2, AlertCircle } from "lucide-react"

interface CheckerProps {
  onCheck: (url: string, violations: number, warnings: number) => void
}

export default function AccessibilityChecker({ onCheck }: CheckerProps) {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    violations: Array<{ type: string; count: number; fix: string }>
    warnings: number
  } | null>(null)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = {
      violations: [
        { type: "Missing alt text", count: 5, fix: "Add descriptive alt text to all images" },
        { type: "Color contrast", count: 3, fix: "Ensure contrast ratio meets WCAG AA standards" },
        { type: "Missing form labels", count: 2, fix: "Associate all form inputs with labels" },
        { type: "Heading hierarchy", count: 1, fix: "Use headings in sequential order" },
      ],
      warnings: 2,
    }

    setResults(mockResults)
    const totalViolations = mockResults.violations.reduce((sum, v) => sum + v.count, 0)
    onCheck(url, totalViolations, mockResults.warnings)
    setLoading(false)
  }

  const exportToHTML = () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Accessibility Report - ${url}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .violation { background: #fee; padding: 15px; margin: 10px 0; border-left: 4px solid #c33; border-radius: 4px; }
    .fix { color: #666; margin-top: 8px; }
  </style>
</head>
<body>
  <h1>Accessibility Report</h1>
  <p><strong>URL:</strong> ${url}</p>
  <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
  <h2>Violations Found</h2>
  ${results?.violations
    .map(
      (v) => `
    <div class="violation">
      <strong>${v.type}</strong> (${v.count} occurrences)
      <div class="fix"><strong>Fix:</strong> ${v.fix}</div>
    </div>
  `,
    )
    .join("")}
</body>
</html>
    `
    const blob = new Blob([html], { type: "text/html" })
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `accessibility-report-${Date.now()}.html`
    a.click()
  }

  const exportToPDF = () => {
    alert("PDF export would be available in Pro plan. HTML export is ready!")
  }

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <Card className="p-8">
        <form onSubmit={handleCheck} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Website URL
            </label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !url} className="min-w-max">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Results */}
      {results && (
        <>
          <Card className="p-8 bg-gradient-to-br from-destructive/5 to-destructive/10">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Violations</p>
                <p className="text-4xl font-bold text-destructive">
                  {results.violations.reduce((sum, v) => sum + v.count, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Issues Found</p>
                <p className="text-4xl font-bold">{results.violations.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Warnings</p>
                <p className="text-4xl font-bold text-yellow-600">{results.warnings}</p>
              </div>
            </div>
          </Card>

          {/* Violations List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Issues to Fix</h2>
            {results.violations.map((violation, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-destructive hover:bg-muted/50 transition-colors">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">{violation.type}</h3>
                    <p className="text-muted-foreground mb-3">{violation.count} occurrences found</p>
                    <div className="bg-primary/10 p-3 rounded text-sm text-primary">
                      <strong>How to fix:</strong> {violation.fix}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Export Options */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Export Report</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={exportToHTML} className="gap-2">
                <Download className="w-4 h-4" />
                Export as HTML
              </Button>
              <Button onClick={exportToPDF} variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export as PDF (Pro)
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
