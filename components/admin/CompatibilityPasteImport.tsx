"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ClipboardPaste,
  Loader2,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Upload,
} from "lucide-react"
import { adminFetch } from "@/lib/admin-fetch"
import {
  parseCompatibilityPaste,
  type CompatibilityPasteRow,
} from "@/lib/compatibility-paste-parser"

interface CompatibilityPasteImportProps {
  productId: number
  onImported?: () => void
}

export function CompatibilityPasteImport({ productId, onImported }: CompatibilityPasteImportProps) {
  const [rawText, setRawText] = useState("")
  const [rows, setRows] = useState<CompatibilityPasteRow[]>([])
  const [softWarning, setSoftWarning] = useState<string | null>(null)
  const [parsed, setParsed] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importSummary, setImportSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(() => {
    const included = rows.filter((r) => r.included)
    return {
      total: rows.length,
      included: included.length,
      warnings: rows.filter((r) => r.parseStatus === "warning").length,
      errors: rows.filter((r) => r.parseStatus === "error").length,
      brands: new Set(rows.map((r) => r.brand_slug).filter(Boolean)).size,
      includedErrors: included.filter((r) => r.parseStatus === "error").length,
    }
  }, [rows])

  const handleParse = () => {
    setError(null)
    setImportSummary(null)
    if (!rawText.trim()) {
      setError("Paste compatibility text first")
      setRows([])
      setParsed(false)
      return
    }
    const result = parseCompatibilityPaste(rawText)
    setRows(result.rows)
    setSoftWarning(result.softWarning)
    setParsed(true)
  }

  const updateRow = (id: string, patch: Partial<CompatibilityPasteRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  const toggleAll = (included: boolean) => {
    setRows((prev) =>
      prev.map((r) => (r.parseStatus === "error" ? { ...r, included: false } : { ...r, included })),
    )
  }

  const canImport = stats.included > 0 && stats.includedErrors === 0 && !importing

  const handleImport = async () => {
    if (!canImport) return
    setImporting(true)
    setError(null)
    setImportSummary(null)

    const payloadRows = rows
      .filter((r) => r.included)
      .map((r) => ({
        brand_display_name: r.brand_display_name,
        section_tag: r.section_tag,
        model_name: r.model_name,
        engine_name: r.engine_name,
        displacement: r.displacement,
        fuel_type: r.fuel_type,
        technology: r.technology,
        power_output: r.power_output,
        variant: r.variant,
        body_style: r.body_style,
        drive_type: r.drive_type,
      }))

    try {
      const res = await adminFetch("/api/compatibility/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, rows: payloadRows }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || data.details || "Import failed")
      }

      const c = data.counts
      setImportSummary(
        `Created ${c.brands_created} brands, ${c.engines_created} engines, ${c.vehicles_created} vehicles. Linked ${c.links_created}, skipped ${c.links_skipped} duplicates${c.rows_failed ? `, ${c.rows_failed} failed` : ""}.`,
      )
      onImported?.()
    } catch (err: any) {
      setError(err?.message || "Import failed")
    } finally {
      setImporting(false)
    }
  }

  return (
    <Card className="shadow-xl" style={{ backgroundColor: "#1f2937", borderColor: "#374151" }}>
      <CardHeader className="pb-4">
        <CardTitle className="text-white text-xl flex items-center gap-3">
          <ClipboardPaste className="h-6 w-6 text-orange-500" />
          Paste Compatibility List
        </CardTitle>
        <p className="text-gray-400 text-sm mt-2">
          Paste brand / model / engine text, review the preview table, then import onto this product.
          Prefer one brand (or one brand section) at a time for best results.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-gray-300">Compatibility text</Label>
          <Textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder={`DACIA\nDOKKER 1,6 LPG\nDUSTER II 1,6 SCE 115\n...`}
            className="min-h-[140px] font-mono text-sm"
            style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#ffffff" }}
            disabled={importing}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleParse}
            disabled={importing || !rawText.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Parse preview
          </Button>
          {parsed && (
            <>
              <Button
                variant="outline"
                onClick={() => toggleAll(true)}
                disabled={importing}
                className="border-gray-500 bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Include all
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleAll(false)}
                disabled={importing}
                className="border-gray-500 bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
              >
                <Square className="h-4 w-4 mr-2" />
                Exclude all
              </Button>
            </>
          )}
        </div>

        {softWarning && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-amber-200 text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{softWarning}</span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {importSummary && (
          <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-green-300 text-sm">
            {importSummary}
          </div>
        )}

        {parsed && (
          <>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{stats.total} rows</Badge>
              <Badge variant="secondary">{stats.brands} brands</Badge>
              <Badge variant="secondary">{stats.included} included</Badge>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40">
                {stats.warnings} warnings
              </Badge>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/40">
                {stats.errors} errors
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-900 text-gray-300">
                  <tr>
                    <th className="p-2">Inc</th>
                    <th className="p-2">Brand</th>
                    <th className="p-2">Section</th>
                    <th className="p-2">Model</th>
                    <th className="p-2">Engine</th>
                    <th className="p-2">Variant</th>
                    <th className="p-2">Body</th>
                    <th className="p-2">Drive</th>
                    <th className="p-2">Status</th>
                    <th className="p-2" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-t border-gray-700 ${
                        row.parseStatus === "error"
                          ? "bg-red-950/30"
                          : row.parseStatus === "warning"
                            ? "bg-amber-950/20"
                            : ""
                      }`}
                    >
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={row.included}
                          disabled={row.parseStatus === "error" || importing}
                          onChange={(e) => updateRow(row.id, { included: e.target.checked })}
                        />
                      </td>
                      <td className="p-2 min-w-[110px]">
                        <Input
                          value={row.brand_display_name}
                          onChange={(e) =>
                            updateRow(row.id, {
                              brand_display_name: e.target.value,
                              brand_slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                              parseStatus:
                                e.target.value.trim() && row.model_name && row.engine_name
                                  ? row.parseStatus === "error"
                                    ? "warning"
                                    : row.parseStatus
                                  : "error",
                            })
                          }
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 min-w-[90px]">
                        <Input
                          value={row.section_tag}
                          onChange={(e) => updateRow(row.id, { section_tag: e.target.value })}
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 min-w-[130px]">
                        <Input
                          value={row.model_name}
                          onChange={(e) => updateRow(row.id, { model_name: e.target.value })}
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 min-w-[140px]">
                        <Input
                          value={row.engine_name}
                          onChange={(e) => updateRow(row.id, { engine_name: e.target.value })}
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 min-w-[90px]">
                        <Input
                          value={row.variant}
                          onChange={(e) => updateRow(row.id, { variant: e.target.value })}
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 min-w-[90px]">
                        <Input
                          value={row.body_style}
                          onChange={(e) => updateRow(row.id, { body_style: e.target.value })}
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 min-w-[80px]">
                        <Input
                          value={row.drive_type}
                          onChange={(e) => updateRow(row.id, { drive_type: e.target.value })}
                          className="h-8 text-xs"
                          style={{ backgroundColor: "#111827", borderColor: "#4b5563", color: "#fff" }}
                        />
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <Badge
                          className={
                            row.parseStatus === "ok"
                              ? "bg-green-500/20 text-green-300"
                              : row.parseStatus === "warning"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-red-500/20 text-red-300"
                          }
                        >
                          {row.parseStatus}
                        </Badge>
                        {row.warning && (
                          <p className="text-[10px] text-gray-400 mt-1 max-w-[140px]">{row.warning}</p>
                        )}
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeRow(row.id)}
                          disabled={importing}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              onClick={handleImport}
              disabled={!canImport}
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white w-full md:w-auto"
            >
              {importing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Import {stats.included} rows to this product
                </>
              )}
            </Button>
            {stats.includedErrors > 0 && (
              <p className="text-red-400 text-sm">
                Fix or exclude error rows before importing.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
