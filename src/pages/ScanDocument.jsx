import { useState, useEffect, useCallback } from 'react'
import {
  Upload,
  Camera,
  FileText,
  ChevronRight,
  ChevronLeft,
  Check,
  Plus,
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
  extractionPrompts,
  suggestedFields,
  sampleExtractionResult,
} from '../data/mockData'

const STEPS = [
  'Upload Document',
  'Document Type',
  'Extraction Prompts',
  'Additional Instructions',
  'Extraction Fields',
  'Custom Fields',
  'Processing',
  'Results',
]

export default function ScanDocument() {
  const [currentStep, setCurrentStep] = useState(0)
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedType, setSelectedType] = useState(null)
  const [typeSearch, setTypeSearch] = useState('')
  const [selectedPrompts, setSelectedPrompts] = useState({})
  const [customPrompts, setCustomPrompts] = useState([])
  const [newPrompt, setNewPrompt] = useState('')
  const [instructions, setInstructions] = useState('')
  const [selectedFields, setSelectedFields] = useState({})
  const [customFields, setCustomFields] = useState([])
  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState('Text')
  const [processingStatus, setProcessingStatus] = useState('uploading')
  const [processingProgress, setProcessingProgress] = useState(0)
  const [resultStatus, setResultStatus] = useState('success')
  const [showJson, setShowJson] = useState(false)
  const [copied, setCopied] = useState(false)

  const availablePrompts = selectedType
    ? extractionPrompts[selectedType] || extractionPrompts['other']
    : []

  const availableFields = selectedType
    ? suggestedFields[selectedType] || suggestedFields['bank-statement']
    : []

  useEffect(() => {
    if (selectedType && Object.keys(selectedPrompts).length === 0) {
      const defaults = {}
      const prompts = extractionPrompts[selectedType] || extractionPrompts['other']
      prompts.forEach((p) => {
        if (p.default) defaults[p.id] = true
      })
      setSelectedPrompts(defaults)
    }
  }, [selectedType])

  useEffect(() => {
    if (selectedType && Object.keys(selectedFields).length === 0) {
      const defaults = {}
      const fields = suggestedFields[selectedType] || suggestedFields['bank-statement']
      fields.forEach((f) => {
        if (f.suggested) defaults[f.id] = true
      })
      setSelectedFields(defaults)
    }
  }, [selectedType])

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
      setCurrentStep(7)
    }, timeout + 800)
  }, [])

  useEffect(() => {
    if (currentStep === 6) {
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

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!file
      case 1: return !!selectedType
      case 2: return Object.values(selectedPrompts).some(Boolean)
      case 3: return true
      case 4: return Object.values(selectedFields).some(Boolean)
      case 5: return true
      default: return true
    }
  }

  const resetScan = () => {
    setCurrentStep(0)
    setFile(null)
    setSelectedType(null)
    setTypeSearch('')
    setSelectedPrompts({})
    setCustomPrompts([])
    setNewPrompt('')
    setInstructions('')
    setSelectedFields({})
    setCustomFields([])
    setNewFieldName('')
    setNewFieldType('Text')
    setProcessingStatus('uploading')
    setProcessingProgress(0)
    setResultStatus('success')
    setShowJson(false)
    setCopied(false)
  }

  const addCustomPrompt = () => {
    if (newPrompt.trim()) {
      setCustomPrompts([...customPrompts, { id: `custom-${Date.now()}`, label: newPrompt.trim() }])
      setNewPrompt('')
    }
  }

  const addCustomField = () => {
    if (newFieldName.trim()) {
      setCustomFields([
        ...customFields,
        { id: `custom-${Date.now()}`, name: newFieldName.trim(), type: newFieldType },
      ])
      setNewFieldName('')
      setNewFieldType('Text')
    }
  }

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleExtractionResult, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredTypes = documentTypes.filter((t) =>
    t.name.toLowerCase().includes(typeSearch.toLowerCase())
  )

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
      {currentStep < 6 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.slice(0, 6).map((step, i) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    i < currentStep
                      ? 'bg-toyota-green text-white'
                      : i === currentStep
                      ? 'bg-toyota-green text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < currentStep ? <Check size={16} /> : i + 1}
                </div>
                {i < 5 && (
                  <div
                    className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-1 ${
                      i < currentStep ? 'bg-toyota-green' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {STEPS.slice(0, 6).map((step, i) => (
              <p
                key={step}
                className={`text-xs text-center max-w-[80px] lg:max-w-none ${
                  i === currentStep ? 'text-toyota-green font-medium' : 'text-gray-400'
                }`}
              >
                <span className="hidden sm:inline">{step}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        {currentStep === 0 && (
          <div>
            <h3 className="text-xl font-semibold text-toyota-black mb-1">Upload Document</h3>
            <p className="text-gray-500 text-sm mb-6">
              Drag & drop or choose a file to begin scanning
            </p>

            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                dragOver
                  ? 'border-toyota-green bg-toyota-green-light'
                  : file
                  ? 'border-toyota-green bg-toyota-green-light/50'
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
                  <div className="w-16 h-16 bg-toyota-green/10 rounded-xl flex items-center justify-center mb-4">
                    <FileText size={32} className="text-toyota-green" />
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
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h3 className="text-xl font-semibold text-toyota-black mb-1">Document Type</h3>
            <p className="text-gray-500 text-sm mb-6">
              Select the type of document you are uploading
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search document type..."
                className="input-field pl-10"
                value={typeSearch}
                onChange={(e) => setTypeSearch(e.target.value)}
              />
              <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <p className="text-sm font-medium text-gray-500 mb-3">Common Document Types</p>

            <div className="space-y-2">
              {filteredTypes.map((type) => (
                <button
                  key={type.id}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                    selectedType === type.id
                      ? 'border-toyota-green bg-toyota-green-light ring-1 ring-toyota-green'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{type.name}</span>
                  {selectedType === type.id && (
                    <div className="ml-auto w-5 h-5 bg-toyota-green rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-semibold text-toyota-black">Extraction Prompts</h3>
              {selectedType && (
                <span className="text-sm text-toyota-green font-medium flex items-center gap-1">
                  <Check size={14} />
                  {documentTypes.find((t) => t.id === selectedType)?.name}
                  <button
                    className="text-gray-400 hover:text-gray-600 ml-1"
                    onClick={() => {
                      setCurrentStep(1)
                    }}
                  >
                    Change
                  </button>
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Upload and extract key information from your{' '}
              {documentTypes.find((t) => t.id === selectedType)?.name?.toLowerCase() || 'document'}.
            </p>

            <p className="text-sm font-medium text-gray-600 mb-3">Basic Prompts</p>

            <div className="space-y-2 mb-6">
              {availablePrompts.map((prompt) => (
                <label
                  key={prompt.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedPrompts[prompt.id]}
                    onChange={() =>
                      setSelectedPrompts((prev) => ({
                        ...prev,
                        [prompt.id]: !prev[prompt.id],
                      }))
                    }
                    className="w-4 h-4 text-toyota-green rounded border-gray-300 focus:ring-toyota-green"
                  />
                  <span className="text-sm text-gray-700">{prompt.label}</span>
                </label>
              ))}
            </div>

            {customPrompts.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 mb-2">Custom Prompts</p>
                {customPrompts.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 mb-2"
                  >
                    <Check size={16} className="text-toyota-green" />
                    <span className="text-sm text-gray-700 flex-1">{cp.label}</span>
                    <button
                      onClick={() =>
                        setCustomPrompts(customPrompts.filter((p) => p.id !== cp.id))
                      }
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom prompt..."
                className="input-field flex-1"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomPrompt()}
              />
              <button
                onClick={addCustomPrompt}
                className="btn-secondary px-4"
                disabled={!newPrompt.trim()}
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="text-xl font-semibold text-toyota-black mb-1">
              Additional Instructions
            </h3>
            <p className="text-gray-500 text-sm mb-6">
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
        )}

        {currentStep === 4 && (
          <div>
            <h3 className="text-xl font-semibold text-toyota-black mb-1">Extraction Fields</h3>
            <p className="text-gray-500 text-sm mb-6">
              Select the fields you want to extract from the document
            </p>

            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search field..."
                className="input-field pl-10"
              />
              <FileText size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <p className="text-sm font-medium text-gray-600 mb-3">Suggested Fields</p>

            <div className="space-y-2 mb-6">
              {availableFields.map((field) => (
                <label
                  key={field.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={!!selectedFields[field.id]}
                    onChange={() =>
                      setSelectedFields((prev) => ({
                        ...prev,
                        [field.id]: !prev[field.id],
                      }))
                    }
                    className="w-4 h-4 text-toyota-green rounded border-gray-300 focus:ring-toyota-green"
                  />
                  <span className="text-sm text-gray-700">{field.name}</span>
                  {field.suggested && (
                    <span className="ml-auto text-xs text-toyota-green bg-toyota-green-light px-2 py-0.5 rounded-full">
                      Suggested
                    </span>
                  )}
                </label>
              ))}
            </div>

            {customFields.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Custom Fields</p>
                {customFields.map((cf) => (
                  <div
                    key={cf.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 mb-2"
                  >
                    <Check size={16} className="text-toyota-green" />
                    <span className="text-sm text-gray-700 flex-1">
                      {cf.name}{' '}
                      <span className="text-xs text-gray-400">({cf.type})</span>
                    </span>
                    <button
                      onClick={() =>
                        setCustomFields(customFields.filter((f) => f.id !== cf.id))
                      }
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <h3 className="text-xl font-semibold text-toyota-black mb-1">Custom Fields</h3>
            <p className="text-gray-500 text-sm mb-6">
              Add any additional fields you want to extract
            </p>

            {customFields.length > 0 && (
              <div className="mb-6 space-y-2">
                {customFields.map((cf) => (
                  <div
                    key={cf.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{cf.name}</p>
                      <p className="text-xs text-gray-400">Type: {cf.type}</p>
                    </div>
                    <button
                      onClick={() =>
                        setCustomFields(customFields.filter((f) => f.id !== cf.id))
                      }
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Branch Name"
                    className="input-field"
                    value={newFieldName}
                    onChange={(e) => setNewFieldName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="input-field"
                    value={newFieldType}
                    onChange={(e) => setNewFieldType(e.target.value)}
                  >
                    <option>Text</option>
                    <option>Number</option>
                    <option>Date</option>
                    <option>Currency</option>
                    <option>Boolean</option>
                  </select>
                </div>
              </div>

              <button
                onClick={addCustomField}
                className="btn-secondary text-sm"
                disabled={!newFieldName.trim()}
              >
                <Plus size={16} />
                Add Another Field
              </button>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold text-toyota-black mb-2">Scan Document</h3>
            <p className="text-gray-500 text-sm mb-8">
              Processing your document... This may take a few minutes.
            </p>

            <div className="relative w-32 h-32 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
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
                <span className="text-2xl font-bold text-toyota-black">
                  {processingProgress}%
                </span>
              </div>
            </div>

            <div className="max-w-sm mx-auto space-y-3 text-left">
              {processingSteps.map((step) => {
                const status = getStepStatus(step.key)
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    {status === 'done' ? (
                      <CheckCircle2 size={20} className="text-toyota-green flex-shrink-0" />
                    ) : status === 'active' ? (
                      <Loader2
                        size={20}
                        className="text-toyota-green flex-shrink-0 animate-spin"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        status === 'active'
                          ? 'text-toyota-green font-medium'
                          : status === 'done'
                          ? 'text-gray-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-toyota-green h-2 rounded-full transition-all duration-500"
                  style={{ width: `${processingProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && !showJson && (
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
                      {file?.name || 'bank_statement_abc.pdf'}
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF &middot; 2.4 MB &middot; 12 Apr 2025
                    </p>
                  </div>
                  <button className="btn-secondary text-sm py-1.5 px-3">
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

                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">Confidence Score</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-toyota-green h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${sampleExtractionResult.confidenceScore}%`,
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-toyota-green">
                      {sampleExtractionResult.confidenceScore}%
                    </span>
                  </div>
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

        {currentStep === 7 && showJson && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-toyota-black">JSON Output</h3>
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

            <pre className="bg-toyota-deep-blue text-gray-100 rounded-xl p-6 overflow-x-auto text-sm font-mono leading-relaxed">
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

        {currentStep < 6 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={prevStep}
              className={`btn-secondary ${currentStep === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft size={18} />
              Back
            </button>
            <button
              onClick={nextStep}
              className="btn-primary"
              disabled={!canProceed()}
            >
              {currentStep === 5 ? 'Start Scan' : 'Next'}
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
