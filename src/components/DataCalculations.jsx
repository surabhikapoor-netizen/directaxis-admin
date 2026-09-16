// Validation rules from the extraction run, shown as readable cards rather
// than raw JSON. Shared by the web and app results screens.
import { useState } from 'react'
import { CheckCircle2, XCircle, AlertCircle, ChevronDown } from 'lucide-react'
import { dataCalculations } from '../data/mockData'

// "VerifyAccountIdentityRule" -> "Verify Account Identity"
function ruleTitle(name) {
  return name.replace(/Rule$/, '').replace(/([a-z])([A-Z])/g, '$1 $2')
}

// "average_monthly_balance" -> "Average Monthly Balance"
function fieldLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const SEVERITY_STYLES = {
  Error: 'bg-red-50 text-red-700',
  Warning: 'bg-amber-50 text-amber-700',
  Info: 'bg-blue-50 text-blue-700',
}

function formatValue(value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2)
  }
  return String(value)
}

// Details vary in shape per rule, so this walks whatever it is given: scalars
// become label/value rows, nested objects become titled groups, and lists of
// objects become small stacked records.
function DetailTree({ data }) {
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value]) => {
        const label = fieldLabel(key)

        if (Array.isArray(value)) {
          if (value.length === 0) {
            return (
              <div key={key} className="flex items-baseline justify-between gap-4 py-1.5">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs text-gray-400">None</span>
              </div>
            )
          }
          if (typeof value[0] !== 'object') {
            return (
              <div key={key} className="flex items-baseline justify-between gap-4 py-1.5">
                <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
                <span className="text-xs font-medium text-gray-800 text-right">
                  {value.join(', ')}
                </span>
              </div>
            )
          }
          return (
            <div key={key} className="pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {label}
              </p>
              <div className="space-y-2">
                {value.map((entry, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 bg-white p-3">
                    <DetailTree data={entry} />
                  </div>
                ))}
              </div>
            </div>
          )
        }

        if (value && typeof value === 'object') {
          return (
            <div key={key} className="pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                {label}
              </p>
              <div className="pl-3 border-l-2 border-gray-100">
                <DetailTree data={value} />
              </div>
            </div>
          )
        }

        return (
          <div key={key} className="flex items-baseline justify-between gap-4 py-1.5">
            <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
            <span className="text-xs font-medium text-gray-800 text-right break-words">
              {formatValue(value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function RuleCard({ rule }) {
  const [open, setOpen] = useState(false)
  const StatusIcon = rule.Passed
    ? CheckCircle2
    : rule.Severity === 'Error'
    ? XCircle
    : AlertCircle
  const statusColor = rule.Passed
    ? 'text-green-600'
    : rule.Severity === 'Error'
    ? 'text-red-500'
    : 'text-amber-500'

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-2.5 p-3.5 text-left active:bg-gray-50 hover:bg-gray-50 transition-colors"
      >
        <StatusIcon size={17} className={`${statusColor} flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-800">
            {ruleTitle(rule.RuleName)}
          </p>

          {/* Badges sit on their own line under the title so the header reads
              the same on every rule, whatever the title length. */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                SEVERITY_STYLES[rule.Severity]
              }`}
            >
              {rule.Severity}
            </span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                rule.Passed ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {rule.Passed ? 'Passed' : 'Not passed'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{rule.Message}</p>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="px-3.5 pb-3.5 pt-1 bg-gray-50 border-t border-gray-100">
          <DetailTree data={rule.Details} />
        </div>
      )}
    </div>
  )
}

export default function DataCalculations({ className = '' }) {
  const [open, setOpen] = useState(false)
  const passedCount = dataCalculations.filter((r) => r.Passed).length

  return (
    <div className={`rounded-xl border border-gray-200 bg-white ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 p-4 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">View Data Calculations</span>
        <span className="text-[11px] text-gray-500">
          {passedCount} of {dataCalculations.length} checks passed
        </span>
        <ChevronDown
          size={17}
          className={`text-gray-400 ml-auto flex-shrink-0 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="p-4 pt-0 space-y-3">
          {dataCalculations.map((rule) => (
            <RuleCard key={rule.RuleName} rule={rule} />
          ))}
        </div>
      )}
    </div>
  )
}
