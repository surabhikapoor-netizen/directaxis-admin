import { useState, useEffect, useCallback } from 'react'
import {
  Upload,
  Camera,
  FileText,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Download,
  RefreshCw,
  Eye,
} from 'lucide-react'
import {
  documentTypes,
  sampleExtractionResult,
  dataCalculations,
} from '../data/mockData'

const STEPS = [
  'Upload Document',
  'Processing',
  'Results',
]

// "VerifyAccountIdentityRule" -> "Verify Account Identity"
function ruleTitle(name) {
  return name.replace(/Rule$/, '').replace(/([a-z])([A-Z])/g, '$1 $2')
}

// "average_monthly_balance" -> "Average Monthly Balance"
function fieldLabel(key) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
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
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm text-gray-400">None</span>
              </div>
            )
          }
          if (typeof value[0] !== 'object') {
            return (
              <div key={key} className="flex items-baseline justify-between gap-4 py-1.5">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-800 text-right">
                  {value.join(', ')}
                </span>
              </div>
            )
          }
          return (
            <div key={key} className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
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
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
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
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right break-words">
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
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <StatusIcon size={18} className={`${statusColor} flex-shrink-0 mt-0.5`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-800">
              {ruleTitle(rule.RuleName)}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                SEVERITY_STYLES[rule.Severity]
              }`}
            >
              {rule.Severity}
            </span>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                rule.Passed ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {rule.Passed ? 'Passed' : 'Not passed'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{rule.Message}</p>
        </div>

        <ChevronDown
          size={18}
          className={`text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
          <DetailTree data={rule.Details} />
        </div>
      )}
    </div>
  )
}

export default function ScanDocument() {
  const [currentStep, setCurrentStep] = useState(0)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [typesOpen, setTypesOpen] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [processingStatus, setProcessingStatus] = useState('uploading')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [resultStatus, setResultStatus] = useState('success')
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)
  const [calcsOpen, setCalcsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  const simulateProcessing = useCallback(() => {
    setProcessingStatus('uploading')
    setProcessingProgress(0)

    const stages = [
      { status: 'uploading', progress: 20, delay: 800 },
      { status: 'classifying', progress: 40, delay: 1200 },
      { status: 'extracting', progress: 60, delay: 2000 },
      { status: 'validating', progress: 80, delay: 1500 },
      { status: 'generating', progress: 95, delay: 1000 },
      { status: 'complete', progress: 100, delay: 500 },
    ]

    let timeout = 0
    stages.forEach((stage) => {
      timeout += stage.delay
      setTimeout(() => {
        setProcessingStatus(stage.status)
        setProcessingProgress(stage.progress)
      }, timeout)
    })

    setTimeout(() => {
      setResultStatus('success')
      setCurrentStep(2)
    }, timeout + 800)
  }, [])

  useEffect(() => {
    if (currentStep === 1) {
      simulateProcessing()
    }
  }, [currentStep, simulateProcessing])

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) setFile(selectedFile)
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1)
  }

  // The uploaded File only exists in memory, so it is previewed through a blob
  // URL. Creating and revoking it in one effect means the URL is released when
  // the preview closes, the file changes, or the page unmounts.
  useEffect(() => {
    if (!previewOpen || !file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => {
      URL.revokeObjectURL(url)
      setPreviewUrl(null)
    }
  }, [previewOpen, file])

  const passedCount = dataCalculations.filter((r) => r.Passed).length

  const openPreview = () => setPreviewOpen(true)
  const closePreview = () => setPreviewOpen(false)

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!file && !!selectedType
      default: return true
    }
  }

  const resetScan = () => {
    setCurrentStep(0)
    setPreviewOpen(false)
    setFile(null)
    setSelectedType(null)
    setInstructions('')
    setProcessingStatus('uploading')
    setProcessingProgress(0)
    setResultStatus('success')
    setShowJson(false)
    setCopied(false)
  }

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleExtractionResult, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const selectedTypeMeta = documentTypes.find((t) => t.id === selectedType)

  const processingSteps = [
    { key: 'uploading', label: 'Document uploaded' },
    { key: 'classifying', label: 'Document classified' },
    { key: 'extracting', label: 'Extracting information' },
    { key: 'validating', label: 'Validating data' },
    { key: 'generating', label: 'Generating results' },
  ]

  const processingOrder = ['uploading', 'classifying', 'extracting', 'validating', 'generating', 'complete']

  const getStepStatus = (stepKey) => {
    const currentIndex = processingOrder.indexOf(processingStatus)
    const stepIndex = processingOrder.indexOf(stepKey)
    if (stepIndex < currentIndex) return 'done'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {currentStep === 0 && (
          <div>
            <h3 className="text-xl font-semibold text-da-black mb-1">Upload Document</h3>
            <p className="text-gray-500 text-sm mb-6">
              Drag & drop or choose a file to begin scanning
            </p>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragOver
                  ? 'border-da-green bg-da-green-light'
                  : file
                  ? 'border-da-green bg-da-green-light/50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-da-green/10 rounded-xl flex items-center justify-center mb-4">
                    <FileText size={32} className="text-da-green" />
                  </div>
                  <p className="text-lg font-medium text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    onClick={() => setFile(null)}
                    className="mt-3 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={14} />
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Upload size={32} className="text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-gray-400 mt-1">PDF, JPG, PNG (Max 10 MB)</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <label className="btn-primary cursor-pointer flex-1">
                <Upload size={18} />
                Choose File
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                />
              </label>
              <button
                className="btn-secondary flex-1"
                onClick={() => {
                  setFile(new File([''], 'camera_capture.jpg', { type: 'image/jpeg' }))
                }}
              >
                <Camera size={18} />
                Take a Photo
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
              Supported formats: PDF, JPG, PNG &middot; Max size 10 MB
            </p>

            {/* Document type and optional instructions now sit with the
                upload, so the whole setup happens on one step. */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-lg font-semibold text-da-black mb-1">Document Type</h4>
              <p className="text-gray-500 text-sm mb-4">
                Select the type of document you are uploading
              </p>

              {/* Collapsed to a dropdown: the trigger carries the choice and the
                  options keep their card styling inside the panel. */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTypesOpen(!typesOpen)}
                  className="input-field flex items-center justify-between text-left"
                >
                  {selectedTypeMeta ? (
                    <span className="flex items-center gap-2.5">
                      <span className="text-xl">{selectedTypeMeta.icon}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {selectedTypeMeta.name}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Select a document type...</span>
                  )}
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform flex-shrink-0 ${
                      typesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {typesOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-2 rounded-xl border border-gray-200 bg-white shadow-lg p-3">
                    <p className="text-sm font-medium text-gray-500 mb-3">Common Document Types</p>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {documentTypes.map((type) => (
                        <button
                          key={type.id}
                          className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                            selectedType === type.id
                              ? 'border-da-green bg-da-green-light ring-1 ring-da-green'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setSelectedType(type.id)
                            setTypesOpen(false)
                          }}
                        >
                          <span className="text-2xl">{type.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{type.name}</span>
                          {selectedType === type.id && (
                            <div className="ml-auto w-5 h-5 bg-da-green rounded-full flex items-center justify-center">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-lg font-semibold text-da-black mb-1">
                Additional Instructions
              </h4>
              <p className="text-gray-500 text-sm mb-4">
                Provide any additional instructions for data extraction (Optional)
              </p>

              <textarea
                className="input-field min-h-[200px] resize-y"
                placeholder="Please also extract the branch name and account type if available."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {instructions.length}/500
              </p>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          /* -m-6 lets the tinted ground fill the card the step sits in. */
          <div className="relative -m-6 overflow-hidden rounded-xl bg-gradient-to-b from-da-green-light via-white to-da-green-light/60 text-center px-6 py-14">
            {/* Drifting ambient glows keep the wait from feeling static. */}
            <span className="absolute -top-24 -left-28 w-80 h-80 rounded-full bg-da-green/25 blur-3xl float-slow" />
            <span className="absolute -bottom-28 -right-24 w-96 h-96 rounded-full bg-emerald-400/25 blur-3xl float-slower" />
            <span className="absolute top-1/3 -right-32 w-64 h-64 rounded-full bg-teal-300/20 blur-3xl float-slow" />

            <h3 className="relative text-xl font-semibold text-da-black mb-2">Scan Document</h3>
            <p className="relative text-gray-600 text-sm mb-8">
              Processing your document... This may take a few minutes.
            </p>

            <div className="relative w-32 h-32 mx-auto mb-8">
              <span
                className="absolute inset-0 rounded-full border-2 border-da-green/25 animate-ping"
                style={{ animationDuration: '2.4s' }}
              />
              <span
                className="absolute inset-3 rounded-full border-2 border-da-green/20 animate-ping"
                style={{ animationDuration: '2.4s', animationDelay: '0.8s' }}
              />
              <svg className="relative w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#1E5E4B"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${processingProgress * 2.64} 264`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-da-black">
                  {processingProgress}%
                </span>
              </div>
            </div>

            <div className="relative max-w-sm mx-auto space-y-3 text-left rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm p-5">
              {processingSteps.map((step) => {
                const status = getStepStatus(step.key)
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    {status === 'done' ? (
                      <CheckCircle2 size={20} className="text-da-green flex-shrink-0" />
                    ) : status === 'active' ? (
                      <Loader2
                        size={20}
                        className="text-da-green flex-shrink-0 animate-spin"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        status === 'active'
                          ? 'text-da-green font-medium'
                          : status === 'done'
                          ? 'text-gray-600'
                          : 'text-gray-300'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="relative max-w-sm mx-auto mt-8">
              <div className="w-full bg-white/70 rounded-full h-2">
                <div
                  className="bg-da-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && !showJson && (
          <div>
            {resultStatus === 'success' ? (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <CheckCircle2 size={16} />
                    Processed Successfully
                  </span>
                </div>

                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {file?.name || 'bank_statement_umhlanga.pdf'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF &middot; 2.4 MB &middot; 12 Apr 2025
                    </p>
                  </div>
                  <button
                    onClick={openPreview}
                    disabled={!file}
                    className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={file ? 'Preview the uploaded document' : 'No document available'}
                  >
                    <Eye size={14} />
                    View Document
                  </button>
                </div>

                <h4 className="font-semibold text-gray-800 mb-4">Extracted Information</h4>

                <div className="space-y-3">
                  {Object.entries({
                    'Account Holder Name': sampleExtractionResult.companyName,
                    'Bank Name': sampleExtractionResult.bankName,
                    'Account Number': sampleExtractionResult.accountNumber,
                    'Statement Period': sampleExtractionResult.statementPeriod,
                    'Opening Balance': `R${sampleExtractionResult.openingBalance.toLocaleString()}`,
                    'Closing Balance': `R${sampleExtractionResult.closingBalance.toLocaleString()}`,
                    'Branch Name': sampleExtractionResult.branchName,
                    'Account Type': sampleExtractionResult.accountType,
                  }).map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2 border-b border-gray-100"
                    >
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setCalcsOpen(!calcsOpen)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <span className="font-semibold text-gray-800">View Data Calculations</span>
                    <span className="text-xs text-gray-500">
                      {passedCount} of {dataCalculations.length} checks passed
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 ml-auto transition-transform ${
                        calcsOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {calcsOpen && (
                    <div className="p-4 pt-0 space-y-3">
                      {dataCalculations.map((rule) => (
                        <RuleCard key={rule.RuleName} rule={rule} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    onClick={() => setShowJson(true)}
                    className="btn-primary flex-1"
                  >
                    <FileText size={18} />
                    View JSON
                  </button>
                  <button onClick={resetScan} className="btn-secondary flex-1">
                    <RefreshCw size={18} />
                    Scan Another Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed</h3>
                <p className="text-gray-500 mb-6">
                  We couldn't process this document. Please try again or upload a different file.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setCurrentStep(6)
                      simulateProcessing()
                    }}
                    className="btn-primary"
                  >
                    <RefreshCw size={18} />
                    Retry
                  </button>
                  <button onClick={resetScan} className="btn-secondary">
                    Upload Different File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && showJson && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-da-black">JSON Output</h3>
              <button
                onClick={copyJson}
                className="btn-secondary text-sm py-1.5 px-3"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copy
                  </>
                )}
              </button>
            </div>

            <pre className="bg-da-deep-blue text-gray-100 rounded-xl p-6 overflow-x-auto text-sm font-mono leading-relaxed">
              {JSON.stringify(sampleExtractionResult, null, 2)
                .split('\n')
                .map((line, i) => (
                  <div key={i} className="flex">
                    <span className="text-gray-500 w-8 text-right mr-4 select-none">
                      {i + 1}
                    </span>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: line
                          .replace(
                            /"([^"]+)":/g,
                            '<span style="color: #7dd3fc">"$1"</span>:'
                          )
                          .replace(
                            /: "([^"]+)"/g,
                            ': <span style="color: #86efac">"$1"</span>'
                          )
                          .replace(
                            /: (\d+)/g,
                            ': <span style="color: #fbbf24">$1</span>'
                          ),
                      }}
                    />
                  </div>
                ))}
            </pre>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button className="btn-primary flex-1">
                <Download size={18} />
                Download JSON
              </button>
              <button
                onClick={() => setShowJson(false)}
                className="btn-secondary flex-1"
              >
                Back to Results
              </button>
            </div>
          </div>
        )}

        {currentStep === 0 && (
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={nextStep}
              className="btn-primary"
              disabled={!canProceed()}
            >
              Start Scan
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {previewOpen && previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-8"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-full flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
              <FileText size={18} className="text-gray-400 flex-shrink-0" />
              <p className="font-medium text-gray-800 text-sm truncate">{file?.name}</p>
              <button
                onClick={closePreview}
                className="ml-auto text-gray-400 hover:text-gray-600"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 min-h-0 bg-gray-50">
              {file?.type?.startsWith('image/') ? (
                <img
                  src={previewUrl}
                  alt={file?.name}
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              ) : (
                <iframe
                  src={previewUrl}
                  title={file?.name}
                  className="w-full h-[70vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
