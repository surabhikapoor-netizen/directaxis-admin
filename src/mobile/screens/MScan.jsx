import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  ChevronLeft,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Zap,
  ZapOff,
  SwitchCamera,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  Copy,
  Download,
  RefreshCw,
  Eye,
} from 'lucide-react'
import {
  documentTypes,
  sampleExtractionResult,
} from '../../data/mockData'
import { useStatusBarTheme } from '../MobileShell'
import DataCalculations from '../../components/DataCalculations'

const STEPS = [
  'Capture',
  'Upload Documents',
]

const processingSteps = [
  { key: 'uploading', label: 'Document uploaded' },
  { key: 'classifying', label: 'Document classified' },
  { key: 'extracting', label: 'Extracting information' },
  { key: 'validating', label: 'Validating data' },
  { key: 'generating', label: 'Generating results' },
]

const processingOrder = [
  'uploading',
  'classifying',
  'extracting',
  'validating',
  'generating',
  'complete',
]

export default function MScan() {
  const navigate = useNavigate()

  const [currentStep, setCurrentStep] = useState(0)
  const [file, setFile] = useState(null)
  const [flash, setFlash] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [typesOpen, setTypesOpen] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [processingStatus, setProcessingStatus] = useState('uploading')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCamera = currentStep === 0
  const onProcessing = currentStep === 2
  useStatusBarTheme(
    onCamera,
    onCamera ? '#1A1A1A' : onProcessing ? '#E8F5F0' : '#FFFFFF'
  )

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

    let elapsed = 0
    const timers = stages.map((stage) => {
      elapsed += stage.delay
      return setTimeout(() => {
        setProcessingStatus(stage.status)
        setProcessingProgress(stage.progress)
      }, elapsed)
    })

    timers.push(setTimeout(() => setCurrentStep(3), elapsed + 800))
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (currentStep === 2) return simulateProcessing()
  }, [currentStep, simulateProcessing])

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!file
      case 1:
        return !!selectedType
      default:
        return true
    }
  }

  const resetScan = () => {
    setCurrentStep(0)
    setFile(null)
    setSelectedType(null)
    setTypesOpen(false)
    setInstructions('')
    setProcessingProgress(0)
    setShowJson(false)
  }

  const getStepStatus = (stepKey) => {
    const current = processingOrder.indexOf(processingStatus)
    const index = processingOrder.indexOf(stepKey)
    if (index < current) return 'done'
    if (index === current) return 'active'
    return 'pending'
  }

  const selectedTypeMeta = documentTypes.find((t) => t.id === selectedType)

  const copyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(sampleExtractionResult, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ---------------------------- Step 0: camera ---------------------------- */

  if (currentStep === 0) {
    return (
      <div className="min-h-full bg-[#1A1A1A] flex flex-col">
        <div className="flex items-center justify-between px-5 py-3">
          <button
            onClick={() => navigate('/app')}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white active:bg-white/20"
          >
            <X size={18} />
          </button>
          <p className="text-white text-sm font-medium">Scan Document</p>
          <button
            onClick={() => setFlash(!flash)}
            className={`w-9 h-9 rounded-full flex items-center justify-center active:bg-white/20 ${
              flash ? 'bg-yellow-400 text-da-black' : 'bg-white/10 text-white'
            }`}
          >
            {flash ? <Zap size={18} /> : <ZapOff size={18} />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="relative w-full aspect-[3/4] rounded-2xl bg-[#232326] overflow-hidden">
            {file ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-da-green/20 flex items-center justify-center mb-4">
                  <FileText size={30} className="text-da-green" />
                </div>
                <p className="text-white font-medium text-sm break-all">{file.name}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  onClick={() => setFile(null)}
                  className="mt-4 text-xs text-red-400 flex items-center gap-1.5 active:text-red-300"
                >
                  <Trash2 size={13} />
                  Retake / remove
                </button>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#26262a_0px,#26262a_12px,#232326_12px,#232326_24px)] opacity-60" />
                <div className="absolute inset-8 rounded-xl border border-white/15" />
                {[
                  'top-6 left-6 border-t-2 border-l-2 rounded-tl-lg',
                  'top-6 right-6 border-t-2 border-r-2 rounded-tr-lg',
                  'bottom-6 left-6 border-b-2 border-l-2 rounded-bl-lg',
                  'bottom-6 right-6 border-b-2 border-r-2 rounded-br-lg',
                ].map((corner) => (
                  <span key={corner} className={`absolute w-10 h-10 border-emerald-400 ${corner}`} />
                ))}
                <div className="absolute inset-x-8 top-1/2 h-0.5 bg-emerald-400/80 scan-pulse" />
                <p className="absolute bottom-10 inset-x-0 text-center text-[11px] text-gray-400 px-8">
                  Position the document inside the frame
                </p>
              </>
            )}
          </div>
        </div>

        <div className="px-8 pb-8 pt-6">
          <div className="flex items-center justify-between">
            <label className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white active:bg-white/20 cursor-pointer">
              <ImageIcon size={20} />
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files[0] && setFile(e.target.files[0])}
              />
            </label>

            <button
              onClick={() =>
                file
                  ? setCurrentStep(1)
                  : setFile(new File([''], 'camera_capture.jpg', { type: 'image/jpeg' }))
              }
              className="w-[74px] h-[74px] rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform"
            >
              <span
                className={`w-[62px] h-[62px] rounded-full flex items-center justify-center ${
                  file ? 'bg-da-green' : 'bg-white'
                }`}
              >
                {file && <Check size={26} className="text-white" />}
              </span>
            </button>

            <button className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white active:bg-white/20">
              <SwitchCamera size={20} />
            </button>
          </div>

          <p className="text-center text-[11px] text-gray-500 mt-5">
            {file ? 'Tap the tick to continue' : 'Tap to capture · PDF, JPG, PNG up to 10 MB'}
          </p>
        </div>
      </div>
    )
  }

  /* -------------------------- Step 6: processing -------------------------- */

  if (currentStep === 2) {
    return (
      <div className="relative min-h-full overflow-hidden bg-gradient-to-b from-da-green-light via-white to-da-green-light/60 flex flex-col items-center justify-center px-8 py-10">
        {/* Drifting ambient glows keep the wait from feeling static. */}
        <span className="absolute -top-16 -left-24 w-64 h-64 rounded-full bg-da-green/25 blur-3xl float-slow" />
        <span className="absolute -bottom-24 -right-20 w-72 h-72 rounded-full bg-emerald-400/25 blur-3xl float-slower" />
        <span className="absolute top-1/3 -right-24 w-48 h-48 rounded-full bg-teal-300/20 blur-3xl float-slow" />

        <div className="relative w-36 h-36">
          <span
            className="absolute inset-0 rounded-full border-2 border-da-green/25 animate-ping"
            style={{ animationDuration: '2.4s' }}
          />
          <span
            className="absolute inset-3 rounded-full border-2 border-da-green/20 animate-ping"
            style={{ animationDuration: '2.4s', animationDelay: '0.8s' }}
          />
          <svg className="relative w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#1E5E4B"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={`${processingProgress * 2.64} 264`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-da-black">{processingProgress}%</span>
          </div>
        </div>

        <h2 className="relative text-lg font-semibold text-da-black mt-7">Scanning document</h2>
        <p className="relative text-sm text-gray-600 mt-1 text-center">
          This usually takes under a minute.
        </p>

        <div className="relative w-full mt-8 space-y-3.5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white/80 shadow-sm p-4">
          {processingSteps.map((step) => {
            const status = getStepStatus(step.key)
            return (
              <div key={step.key} className="flex items-center gap-3">
                {status === 'done' ? (
                  <CheckCircle2 size={20} className="text-da-green flex-shrink-0" />
                ) : status === 'active' ? (
                  <Loader2 size={20} className="text-da-green flex-shrink-0 animate-spin" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
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
      </div>
    )
  }

  /* ---------------------------- Step 7: results --------------------------- */

  if (currentStep === 3) {
    if (showJson) {
      return (
        <div className="min-h-full bg-white flex flex-col">
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
            <button
              onClick={() => setShowJson(false)}
              className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-da-black active:bg-gray-100"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-base font-semibold text-da-black flex-1">JSON Output</h1>
            <button
              onClick={copyJson}
              className="flex items-center gap-1.5 text-xs font-medium text-da-green px-3 py-1.5 rounded-lg bg-da-green-light"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div className="flex-1 p-4">
            <pre className="bg-da-deep-blue text-gray-100 rounded-2xl p-4 overflow-x-auto text-[11px] font-mono leading-relaxed">
              {JSON.stringify(sampleExtractionResult, null, 2)}
            </pre>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 pb-5">
            <button className="m-btn">
              <Download size={17} />
              Download JSON
            </button>
          </div>
        </div>
      )
    }

    const extracted = {
      'Account Holder': sampleExtractionResult.companyName,
      'Bank Name': sampleExtractionResult.bankName,
      'Account Number': sampleExtractionResult.accountNumber,
      'Statement Period': sampleExtractionResult.statementPeriod,
      'Opening Balance': `R${sampleExtractionResult.openingBalance.toLocaleString()}`,
      'Closing Balance': `R${sampleExtractionResult.closingBalance.toLocaleString()}`,
      'Branch Name': sampleExtractionResult.branchName,
      'Account Type': sampleExtractionResult.accountType,
    }

    return (
      <div className="min-h-full bg-da-bg flex flex-col">
        <div className="bg-white px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-da-black">Scan Results</h1>
            <button
              onClick={() => navigate('/app')}
              className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-200"
            >
              <X size={17} />
            </button>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 mt-3">
            <CheckCircle2 size={13} />
            Processed successfully
          </span>
        </div>

        <div className="flex-1 p-4 space-y-4">
          <div className="m-card p-4 flex items-center gap-3">
            <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText size={20} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file?.name || 'bank_statement_umhlanga.pdf'}
              </p>
              <p className="text-[11px] text-gray-400">PDF &middot; 2.4 MB &middot; 15 Sep 2026</p>
            </div>
            <button className="w-9 h-9 rounded-xl bg-da-green-light flex items-center justify-center text-da-green">
              <Eye size={17} />
            </button>
          </div>

          <div className="m-card overflow-hidden">
            <p className="text-xs font-semibold text-gray-600 px-4 pt-4 pb-2">
              Extracted Information
            </p>
            <div className="divide-y divide-gray-50">
              {Object.entries(extracted).map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
                  <span className="text-sm font-medium text-gray-800 text-right truncate">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <DataCalculations />
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 pb-5 space-y-2.5">
          <button onClick={() => setShowJson(true)} className="m-btn">
            <FileText size={17} />
            View JSON
          </button>
          <button onClick={resetScan} className="m-btn-ghost">
            <RefreshCw size={17} />
            Scan Another Document
          </button>
        </div>
      </div>
    )
  }

  /* ------------------------ Steps 1-5: setup forms ------------------------ */

  return (
    <div className="min-h-full bg-da-bg flex flex-col">
      <div className="bg-white px-5 pt-1 pb-3 sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-da-black active:bg-gray-100"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-da-black truncate">
              {STEPS[currentStep]}
            </h1>
            <p className="text-[11px] text-gray-400">
              Step {currentStep + 1} of {STEPS.length}
            </p>
          </div>
          <button
            onClick={() => navigate('/app')}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:bg-gray-200"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex gap-1 mt-3">
          {STEPS.map((step, i) => (
            <span
              key={step}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStep ? 'bg-da-green' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 space-y-3">
        {currentStep === 1 && (
          <>
            <div className="m-card p-4">
              <p className="text-sm font-semibold text-da-black mb-1">Document Type</p>
              <p className="text-xs text-gray-500 mb-3">
                Select the type of document you are uploading
              </p>

              {/* Type picker collapsed to a dropdown so both sections fit one screen. */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTypesOpen(!typesOpen)}
                  className="m-input flex items-center justify-between text-left"
                >
                  {selectedTypeMeta ? (
                    <span className="flex items-center gap-2.5">
                      <span className="text-xl">{selectedTypeMeta.icon}</span>
                      <span className="text-sm font-medium text-gray-800">
                        {selectedTypeMeta.name}
                      </span>
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">Select a document type...</span>
                  )}
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform ${
                      typesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {typesOpen && (
                  <div className="absolute z-20 left-0 right-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg p-2 max-h-72 overflow-y-auto space-y-2">
                    {documentTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setSelectedType(type.id)
                          setTypesOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                          selectedType === type.id
                            ? 'border-da-green bg-da-green-light'
                            : 'border-gray-100 bg-white active:bg-gray-50'
                        }`}
                      >
                        <span className="text-2xl">{type.icon}</span>
                        <span className="text-sm font-medium text-gray-800 flex-1">{type.name}</span>
                        {selectedType === type.id && (
                          <span className="w-5 h-5 bg-da-green rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="m-card p-4">
              <p className="text-sm font-semibold text-da-black mb-1">
                Additional Instruction
              </p>
              <p className="text-xs text-gray-500 mb-3">
                Anything else the extractor should know? (Optional)
              </p>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={500}
                placeholder="Please also extract the branch name and account type if available."
                className="m-input min-h-[160px] resize-none"
              />
              <p className="text-[11px] text-gray-400 text-right mt-1.5">
                {instructions.length}/500
              </p>
            </div>
          </>
        )}

      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 pb-5">
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={!canProceed()}
          className="m-btn"
        >
          {currentStep === 1 ? 'Start Scan' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
