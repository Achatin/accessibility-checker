"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"

interface Check {
  id: string
  url: string
  date: string
  violations: number
  warnings: number
}

interface HistoryProps {
  checks: Check[]
}

export default function CheckHistory({ checks }: HistoryProps) {
  if (checks.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No checks yet. Start by scanning a website!</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {checks.map((check) => (
        <Card key={check.id} className="p-6 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-grow">
              <h3 className="font-semibold text-lg break-all">{check.url}</h3>
              <p className="text-sm text-muted-foreground mt-1">{check.date}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-2xl font-bold text-destructive">{check.violations}</p>
                <p className="text-xs text-muted-foreground">violations</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
