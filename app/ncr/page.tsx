'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ADMIN_EMAIL = 'harlene@example.com'
const SIG_BUCKET = 'signatures'

type UserRole = 'admin' | 'editor' | 'viewer' | null
type Severity = 'Major' | 'Minor' | null

interface NCR {
  id: string
  ncr_number: string
  title: string
  description: string
  root_cause: string
  corrective_action: string
  date_raised: string
  target_close_date: string
  created_by: string
  prepared_by?: string | null
  prepared_signed_at?: string | null
  approved_by?: string | null
  approved_signed_at?: string | null
  audit_date?: string | null
  iso_element?: string | null
  severity?: Severity
  internal_auditors?: string | null
  acknowledged_by?: string | null
  responsibility?: string | null
  agreed_due_date?: string | null
  verification_text?: string | null
  auditor_name?: string | null
  date_closed?: string | null
  auditor_signature_path?: string | null
  acknowledger_signature_path?: string | null
}

/* ─────────────────────────────────────────
   ISO CLAUSE LIST — searchable combobox source
───────────────────────────────────────── */
interface IsoClause {
  standard: '9001' | '14001' | '45001'
  number: string
  title: string
  parent?: string // for visual hierarchy in the dropdown
}

const ISO_CLAUSES: IsoClause[] = [
  // ISO 9001:2015
  { standard: '9001', number: '8.1', title: 'Operational planning and control' },
  { standard: '9001', number: '8.2', title: 'Requirements for products and services' },
  { standard: '9001', number: '8.2.1', title: 'Customer communication', parent: '8.2' },
  { standard: '9001', number: '8.2.2', title: 'Determining requirements for products and services', parent: '8.2' },
  { standard: '9001', number: '8.2.3', title: 'Review of requirements for products and services', parent: '8.2' },
  { standard: '9001', number: '8.2.4', title: 'Changes to requirements for products and services', parent: '8.2' },
  { standard: '9001', number: '8.3', title: 'Design and development of products and services' },
  { standard: '9001', number: '8.3.1', title: 'General', parent: '8.3' },
  { standard: '9001', number: '8.3.2', title: 'Design and development planning', parent: '8.3' },
  { standard: '9001', number: '8.3.3', title: 'Design and development inputs', parent: '8.3' },
  { standard: '9001', number: '8.3.4', title: 'Design and development controls', parent: '8.3' },
  { standard: '9001', number: '8.3.5', title: 'Design and development outputs', parent: '8.3' },
  { standard: '9001', number: '8.3.6', title: 'Design and development changes', parent: '8.3' },
  { standard: '9001', number: '8.4', title: 'Control of externally provided processes, products and services' },
  { standard: '9001', number: '8.4.1', title: 'General', parent: '8.4' },
  { standard: '9001', number: '8.4.2', title: 'Type and extent of control', parent: '8.4' },
  { standard: '9001', number: '8.4.3', title: 'Information for external providers', parent: '8.4' },
  { standard: '9001', number: '8.5', title: 'Production and service provision' },
  { standard: '9001', number: '8.5.1', title: 'Control of production and service provision', parent: '8.5' },
  { standard: '9001', number: '8.5.2', title: 'Identification and traceability', parent: '8.5' },
  { standard: '9001', number: '8.5.3', title: 'Property belonging to customers or external providers', parent: '8.5' },
  { standard: '9001', number: '8.5.4', title: 'Preservation', parent: '8.5' },
  { standard: '9001', number: '8.5.5', title: 'Post-delivery activities', parent: '8.5' },
  { standard: '9001', number: '8.5.6', title: 'Control of changes', parent: '8.5' },
  { standard: '9001', number: '8.6', title: 'Release of products and services' },
  { standard: '9001', number: '8.7', title: 'Control of nonconforming outputs' },
  // ISO 14001:2015
  { standard: '14001', number: '8.1', title: 'Operational planning and control' },
  { standard: '14001', number: '8.2', title: 'Emergency preparedness and response' },
  // ISO 45001:2018
  { standard: '45001', number: '8.1', title: 'Operational planning and control' },
  { standard: '45001', number: '8.1.1', title: 'General', parent: '8.1' },
  { standard: '45001', number: '8.1.2', title: 'Eliminating hazards and reducing OH&S risks', parent: '8.1' },
  { standard: '45001', number: '8.1.3', title: 'Management of change', parent: '8.1' },
  { standard: '45001', number: '8.1.4', title: 'Procurement', parent: '8.1' },
  { standard: '45001', number: '8.1.4.1', title: 'General', parent: '8.1.4' },
  { standard: '45001', number: '8.1.4.2', title: 'Contractors', parent: '8.1.4' },
  { standard: '45001', number: '8.1.4.3', title: 'Outsourcing', parent: '8.1.4' },
  { standard: '45001', number: '8.2', title: 'Emergency preparedness and response' },
]

const STANDARD_YEARS: Record<string, string> = {
  '9001': '2015',
  '14001': '2015',
  '45001': '2018',
}

const formatClauseLabel = (c: IsoClause) =>
  `ISO ${c.standard}:${STANDARD_YEARS[c.standard]} Clause ${c.number} – ${c.title}`

/* ─────────────────────────────────────────
   ICONS
───────────────────────────────────────── */
const HomeIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
)
const AlertIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
)
const ShieldIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
)
const BookIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
)
const ClipboardListIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 12h6" /><path d="M9 16h6" /></svg>
)
const WorkflowIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" /><path d="M9 6h6a3 3 0 0 1 3 3v6" /></svg>
)
const FormIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="14" y2="13" /><line x1="8" y1="17" x2="12" y2="17" /></svg>
)
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 6L9 17l-5-5" /></svg>
)
const LogoutIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
)
const ChevronDownIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9" /></svg>
)

/* ─────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────── */
const Sidebar = ({ role, userEmail, onLogout }: { role: UserRole; userEmail: string; onLogout?: () => void }) => {
  const initial = userEmail ? userEmail[0].toUpperCase() : 'N'
  const roleLabel = role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Viewer'

  const navItem = (href: string, icon: React.ReactNode, label: string, key: string, badge?: number | string, tierCode?: string, active = false) => (
    <Link key={key} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all ${active ? 'bg-emerald-50 text-emerald-950 shadow-sm' : 'text-emerald-100 hover:bg-emerald-800/50'}`}>
      <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${active ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-emerald-300'}`}>{icon}</div>
      {tierCode ? (
        <span className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className={`text-[10px] font-semibold shrink-0 ${active ? 'text-emerald-600' : 'text-emerald-500'}`}>{tierCode}</span>
          <span className="text-sm font-medium truncate">{label}</span>
        </span>
      ) : (
        <span className="text-sm font-medium flex-1">{label}</span>
      )}
      {badge !== undefined && (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${active ? 'bg-emerald-600 text-white' : 'bg-emerald-800 text-emerald-400'}`}>{badge}</span>
      )}
    </Link>
  )

  return (
    <aside className="w-72 bg-emerald-900 text-emerald-50 flex flex-col min-h-screen sticky top-0">
      <Link href="/dashboard" className="flex items-center gap-3 p-6 border-b border-emerald-800/60 hover:bg-emerald-800/30 transition-all">
        <img src="/operon-logo-green.png" alt="Operon" className="w-9 h-9 rounded-lg object-contain bg-white p-1 shrink-0" />
        <div>
          <div className="font-semibold text-sm leading-tight text-white">ISO IMS Portal</div>
          <div className="text-xs text-emerald-300 leading-tight">Operon Middle East</div>
        </div>
      </Link>

      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 py-2 mb-1">Modules</div>
        {navItem('/dashboard', <HomeIcon className="w-4 h-4" />, 'Home', 'home')}
        {navItem('/ncr', <AlertIcon className="w-4 h-4" />, 'Non-Conformance', 'ncr', 0, undefined, true)}

        <div className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider px-3 pt-5 pb-2">Document Tiers</div>
        {navItem('/documents/policies', <ShieldIcon className="w-4 h-4" />, 'Policies', 't1', 1, 'T1')}
        {navItem('/documents/manual', <BookIcon className="w-4 h-4" />, 'IMS Manual, Plan, ...', 't2', 0, 'T2')}
        {navItem('/documents/procedures', <ClipboardListIcon className="w-4 h-4" />, 'Procedures', 't3', 0, 'T3')}
        {navItem('/documents/work', <WorkflowIcon className="w-4 h-4" />, 'Work Instructions, ...', 't4', 0, 'T4')}
        {navItem('/documents/forms', <FormIcon className="w-4 h-4" />, 'Forms', 't5', 0, 'T5')}
      </nav>

      <div className="flex items-center gap-3 px-4 py-4 border-t border-emerald-800/60">
        <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-semibold text-emerald-200 shrink-0">{initial}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white leading-tight">{roleLabel}</div>
          <div className="text-xs text-emerald-400 truncate">{userEmail}</div>
        </div>
        <button type="button" onClick={onLogout} title="Log out" className="w-7 h-7 flex items-center justify-center rounded-md text-emerald-400 hover:bg-emerald-800 hover:text-emerald-200 transition-all">
          <LogoutIcon className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}

const Topbar = ({ crumb, userEmail, role }: { crumb: string; userEmail: string; role: UserRole }) => {
  const initial = userEmail ? userEmail[0].toUpperCase() : 'N'
  const roleLabel = role === 'admin' ? 'Admin' : role === 'editor' ? 'Editor' : 'Viewer'
  return (
    <div className="flex items-center justify-between px-7 py-3 border-b border-emerald-100 bg-white sticky top-0 z-10">
      <span className="text-sm text-emerald-700">{crumb}</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          {roleLabel}
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center text-[11px] font-semibold text-emerald-200">{initial}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   ISO ELEMENT COMBOBOX (type-to-filter)
───────────────────────────────────────── */
const IsoElementCombobox = ({
  value,
  onChange,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ISO_CLAUSES
    return ISO_CLAUSES.filter((c) => {
      const label = formatClauseLabel(c).toLowerCase()
      return label.includes(q) || c.number.toLowerCase().includes(q) || c.standard.includes(q)
    })
  }, [query])

  // Group by standard for the dropdown
  const grouped = useMemo(() => {
    const groups: Record<string, IsoClause[]> = { '9001': [], '14001': [], '45001': [] }
    filtered.forEach((c) => groups[c.standard].push(c))
    return groups
  }, [filtered])

  const standardLabels: Record<string, string> = {
    '9001': 'ISO 9001:2015 — Quality Management',
    '14001': 'ISO 14001:2015 — Environmental Management',
    '45001': 'ISO 45001:2018 — Occupational Health & Safety',
  }

  const selectClause = (c: IsoClause) => {
    const label = formatClauseLabel(c)
    setQuery(label)
    onChange(label)
    setOpen(false)
  }

  // Indent depth for visual hierarchy
  const indent = (c: IsoClause) => {
    const dots = (c.number.match(/\./g) || []).length
    return dots // 8 = 0, 8.1 = 1, 8.1.1 = 2, 8.1.4.2 = 3
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder="Type to search clauses (e.g. 8.4, control, emergency)…"
          className="w-full px-3 py-2.5 pr-10 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all disabled:bg-emerald-50/60 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-500 hover:text-emerald-700 transition disabled:opacity-50"
          aria-label="Toggle dropdown"
        >
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-emerald-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-emerald-500">
              No clauses match "{query}". You can keep typing — your text will still be saved as the ISO Element.
            </div>
          ) : (
            (['9001', '14001', '45001'] as const).map((std) => {
              const items = grouped[std]
              if (items.length === 0) return null
              return (
                <div key={std} className="border-b border-emerald-50 last:border-0">
                  <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50/80 sticky top-0">
                    {standardLabels[std]}
                  </div>
                  {items.map((c) => (
                    <button
                      key={`${std}-${c.number}`}
                      type="button"
                      onClick={() => selectClause(c)}
                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 transition flex items-baseline gap-2"
                      style={{ paddingLeft: `${12 + indent(c) * 14}px` }}
                    >
                      <span className="font-mono text-xs font-semibold text-emerald-700 shrink-0 min-w-[3.5rem]">
                        {c.number}
                      </span>
                      <span className="text-sm text-emerald-900 truncate">{c.title}</span>
                    </button>
                  ))}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   FIELD HELPERS
───────────────────────────────────────── */
const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-emerald-100/60 border-y border-emerald-200 px-5 py-2 text-xs font-semibold text-emerald-900 uppercase tracking-wider">
    {children}
  </div>
)

const Field = ({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) => (
  <div className={`flex-1 ${className}`}>
    <label className="block text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-1.5">{label}</label>
    {children}
  </div>
)

const ReadField = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <label className="block text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-1.5">{label}</label>
    <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg px-3 py-2.5 min-h-[42px] text-sm text-emerald-900 whitespace-pre-wrap leading-relaxed">
      {value || '—'}
    </div>
  </div>
)

const SeverityToggle = ({
  value,
  onChange,
  disabled,
}: {
  value: Severity
  onChange: (v: Severity) => void
  disabled?: boolean
}) => (
  <div className="flex gap-3">
    {(['Major', 'Minor'] as const).map((opt) => {
      const active = value === opt
      return (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onChange(active ? null : opt)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
            active
              ? opt === 'Major'
                ? 'bg-rose-50 border-rose-400 text-rose-800'
                : 'bg-amber-50 border-amber-400 text-amber-800'
              : 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
            active
              ? opt === 'Major'
                ? 'bg-rose-500 border-rose-500'
                : 'bg-amber-500 border-amber-500'
              : 'border-emerald-300 bg-white'
          }`}>
            {active && <CheckIcon className="w-3 h-3 text-white" />}
          </span>
          {opt}
        </button>
      )
    })}
  </div>
)

const SignatureUpload = ({
  label,
  file,
  onFileChange,
  signedUrl,
  disabled,
}: {
  label: string
  file: File | null
  onFileChange: (f: File | null) => void
  signedUrl?: string | null
  disabled?: boolean
}) => {
  const inputId = `sig-${label.replace(/\s+/g, '-').toLowerCase()}`
  const localPreview = file ? URL.createObjectURL(file) : null
  const previewSrc = localPreview || signedUrl || null

  return (
    <div>
      <label className="block text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-1.5">{label}</label>
      <label htmlFor={inputId} className={`block border-2 border-dashed rounded-lg p-4 text-center transition ${disabled ? 'border-emerald-100 bg-emerald-50/30 cursor-not-allowed' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40 cursor-pointer'}`}>
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,.png,.jpg,.jpeg"
          className="hidden"
          disabled={disabled}
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
        />
        {previewSrc ? (
          <div className="flex flex-col items-center gap-2">
            <img src={previewSrc} alt={`${label} signature`} className="max-h-24 object-contain" />
            <span className="text-xs text-emerald-700">{file ? file.name : 'Saved signature'}</span>
          </div>
        ) : (
          <div className="text-sm text-emerald-500 py-2">
            Click to upload signature image (PNG / JPG)
          </div>
        )}
      </label>
    </div>
  )
}

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-emerald-50/40" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
    <div className="text-sm tracking-widest text-emerald-500">Loading…</div>
  </div>
)

/* ═════════════════════════════════════════
   PAGE COMPONENT
═════════════════════════════════════════ */
export default function NCRFormPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [role, setRole] = useState<UserRole>(null)
  const [ncrList, setNcrList] = useState<NCR[]>([])
  const [selectedNCR, setSelectedNCR] = useState<NCR | null>(null)
  const [signaturePreviews, setSignaturePreviews] = useState<{ auditor?: string; ack?: string }>({})

  const todayDate = new Date().toISOString().slice(0, 10)
  const now = new Date().toISOString().slice(0, 16)

  const [form, setForm] = useState({
    title: '',
    auditDate: todayDate,
    isoElement: '',
    severity: null as Severity,
    description: '',
    internalAuditors: '',
    acknowledgedBy: '',
    rootCause: '',
    correctiveAction: '',
    agreedDueDate: '',
    responsibility: '',
    verificationText: '',
    auditorName: '',
    dateClosed: '',
    dateRaised: now,
    targetCloseDate: '',
    preparedBy: null as string | null,
    preparedSignedAt: null as string | null,
    approvedBy: null as string | null,
    approvedSignedAt: null as string | null,
  })

  const [auditorSig, setAuditorSig] = useState<File | null>(null)
  const [ackSig, setAckSig] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { init() }, [])

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const email = (user.email || '').toLowerCase()
    setUserEmail(email)

    if (email === ADMIN_EMAIL.toLowerCase()) {
      setRole('admin')
      setLoading(false)
      return
    }

    const { data: editorData } = await supabase
      .from('ncr_editors')
      .select('email')
      .ilike('email', email)
      .maybeSingle()

    if (editorData) {
      setRole('editor')
      setLoading(false)
      return
    }

    setRole('viewer')
    await loadNCRsForViewer()
    setLoading(false)
  }

  const loadNCRsForViewer = async () => {
    const { data, error } = await supabase
      .from('ncrs')
      .select('*')
      .order('date_raised', { ascending: false })
    if (!error && data) setNcrList(data as NCR[])
  }

  // Load signed URLs for selected NCR's signature images (viewer mode)
  useEffect(() => {
    const loadSigs = async () => {
      if (!selectedNCR) { setSignaturePreviews({}); return }
      const previews: { auditor?: string; ack?: string } = {}
      if (selectedNCR.auditor_signature_path) {
        const { data } = await supabase.storage.from(SIG_BUCKET).createSignedUrl(selectedNCR.auditor_signature_path, 3600)
        if (data?.signedUrl) previews.auditor = data.signedUrl
      }
      if (selectedNCR.acknowledger_signature_path) {
        const { data } = await supabase.storage.from(SIG_BUCKET).createSignedUrl(selectedNCR.acknowledger_signature_path, 3600)
        if (data?.signedUrl) previews.ack = data.signedUrl
      }
      setSignaturePreviews(previews)
    }
    loadSigs()
  }, [selectedNCR])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const uploadSignature = async (file: File, ncrNumber: string, kind: 'auditor' | 'ack'): Promise<string | null> => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const path = `${ncrNumber}/${kind}-${Date.now()}.${ext}`
    const { error } = await supabase.storage.from(SIG_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) {
      console.error('Signature upload error:', error.message)
      return null
    }
    return path
  }

  const submitNCR = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const ncrNumber = `NCR-${Date.now()}`

      // Upload signatures first (best effort — NCR still saves if these fail)
      let auditorPath: string | null = null
      let ackPath: string | null = null
      if (auditorSig) auditorPath = await uploadSignature(auditorSig, ncrNumber, 'auditor')
      if (ackSig) ackPath = await uploadSignature(ackSig, ncrNumber, 'ack')

      const { error } = await supabase.from('ncrs').insert({
        ncr_number: ncrNumber,
        title: form.title || `NCR ${form.isoElement || 'audit finding'}`.slice(0, 120),
        description: form.description,
        root_cause: form.rootCause,
        corrective_action: form.correctiveAction,
        date_raised: form.dateRaised,
        target_close_date: form.targetCloseDate,
        created_by: userEmail,
        prepared_by: form.preparedBy,
        prepared_signed_at: form.preparedSignedAt,
        approved_by: form.approvedBy,
        approved_signed_at: form.approvedSignedAt,
        audit_date: form.auditDate || null,
        iso_element: form.isoElement || null,
        severity: form.severity,
        internal_auditors: form.internalAuditors || null,
        acknowledged_by: form.acknowledgedBy || null,
        responsibility: form.responsibility || null,
        agreed_due_date: form.agreedDueDate || null,
        verification_text: form.verificationText || null,
        auditor_name: form.auditorName || null,
        date_closed: form.dateClosed || null,
        auditor_signature_path: auditorPath,
        acknowledger_signature_path: ackPath,
      })
      if (error) {
        alert('Error saving NCR: ' + error.message)
      } else {
        alert('NCR saved successfully')
        // Reset
        setForm({
          ...form,
          title: '', isoElement: '', severity: null, description: '',
          internalAuditors: '', acknowledgedBy: '', rootCause: '', correctiveAction: '',
          agreedDueDate: '', responsibility: '', verificationText: '', auditorName: '',
          dateClosed: '', targetCloseDate: '',
          preparedBy: null, preparedSignedAt: null, approvedBy: null, approvedSignedAt: null,
        })
        setAuditorSig(null)
        setAckSig(null)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const signAsPrepared = () => setForm({ ...form, preparedBy: userEmail, preparedSignedAt: new Date().toISOString() })
  const signAsApproved = () => setForm({ ...form, approvedBy: userEmail, approvedSignedAt: new Date().toISOString() })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <LoadingScreen />

  const isAdmin = role === 'admin'
  const canEdit = role === 'admin' || role === 'editor'
  const isViewer = role === 'viewer'

  const shell = (children: React.ReactNode) => (
    <div className="min-h-screen bg-emerald-50/40 text-emerald-950 flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <Sidebar role={role} userEmail={userEmail} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar crumb="Non-Conformance" userEmail={userEmail} role={role} />
        <div className="flex-1 p-8 flex flex-col gap-5 max-w-5xl">
          {children}
        </div>
      </div>
    </div>
  )

  /* ──────────────────────────────────────
     VIEWER MODE — unchanged list + read-only detail showing all new fields
  ────────────────────────────────────── */
  if (isViewer) {
    return shell(
      selectedNCR ? (
        <>
          <div>
            <button type="button" onClick={() => setSelectedNCR(null)} className="px-3 py-1.5 text-xs font-medium border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all">
              ← Back to list
            </button>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400 mb-1">Internal Audit · Non-Conformance Report</p>
            <h1 className="text-2xl font-semibold text-emerald-950">{selectedNCR.title}</h1>
            <p className="text-xs text-emerald-400 mt-1">{selectedNCR.ncr_number} · Created by {selectedNCR.created_by}</p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-2 gap-0 border-b border-emerald-200">
              <div className="p-5 border-r border-emerald-200 space-y-4">
                <ReadField label="Audit Date" value={selectedNCR.audit_date} />
              </div>
              <div className="p-5 space-y-4">
                <ReadField label="ISO Element" value={selectedNCR.iso_element} />
              </div>
            </div>

            <SectionHeader>Description of the Non-Conformance</SectionHeader>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-1.5">Severity</label>
                <div className="text-sm text-emerald-900">
                  {selectedNCR.severity ? (
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${selectedNCR.severity === 'Major' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                      <CheckIcon className="w-3 h-3" />
                      {selectedNCR.severity}
                    </span>
                  ) : <span className="text-emerald-400">—</span>}
                </div>
              </div>
              <ReadField label="Description" value={selectedNCR.description} />
            </div>

            <SectionHeader>Signatures</SectionHeader>
            <div className="grid grid-cols-2 gap-0 border-b border-emerald-200">
              <div className="p-5 border-r border-emerald-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-1.5">Auditor Signature</label>
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 min-h-[100px] flex items-center justify-center">
                    {signaturePreviews.auditor ? (
                      <img src={signaturePreviews.auditor} alt="Auditor signature" className="max-h-20 object-contain" />
                    ) : <span className="text-xs text-emerald-400 italic">No signature on file</span>}
                  </div>
                </div>
                <ReadField label="Internal Auditors" value={selectedNCR.internal_auditors} />
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-1.5">Acknowledgment Signature</label>
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3 min-h-[100px] flex items-center justify-center">
                    {signaturePreviews.ack ? (
                      <img src={signaturePreviews.ack} alt="Acknowledger signature" className="max-h-20 object-contain" />
                    ) : <span className="text-xs text-emerald-400 italic">No signature on file</span>}
                  </div>
                </div>
                <ReadField label="Acknowledged By" value={selectedNCR.acknowledged_by} />
              </div>
            </div>

            <SectionHeader>Determination of Root Cause</SectionHeader>
            <div className="p-5"><ReadField label="Root Cause" value={selectedNCR.root_cause} /></div>

            <SectionHeader>Corrective Action</SectionHeader>
            <div className="p-5 space-y-4">
              <ReadField label="Corrective Action" value={selectedNCR.corrective_action} />
              <div className="grid grid-cols-2 gap-4">
                <ReadField label="Agreed Due Date" value={selectedNCR.agreed_due_date} />
                <ReadField label="Responsibility" value={selectedNCR.responsibility} />
              </div>
            </div>

            <SectionHeader>Verification of Corrective Action's Effectiveness</SectionHeader>
            <div className="p-5"><ReadField label="Verification" value={selectedNCR.verification_text} /></div>

            <SectionHeader>Closure</SectionHeader>
            <div className="grid grid-cols-2 gap-0 p-5">
              <div className="pr-4 border-r border-emerald-100"><ReadField label="Auditor Name & Signature" value={selectedNCR.auditor_name} /></div>
              <div className="pl-4"><ReadField label="Date Closed" value={selectedNCR.date_closed} /></div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400 mb-1">Reports</p>
            <h1 className="text-2xl font-semibold text-emerald-950">Non-Conformance Reports</h1>
            <p className="text-sm text-emerald-500 mt-1">You have view-only access to all submitted reports.</p>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
            <p className="text-sm text-amber-800">
              <strong>Viewer Mode — Read Only.</strong> Contact your administrator to request edit or submission permissions.
            </p>
          </div>

          <div className="bg-white border border-emerald-100 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-100">
              <span className="text-sm font-semibold text-emerald-900">Report Registry</span>
              <span className="text-xs text-emerald-400">{ncrList.length} report{ncrList.length !== 1 ? 's' : ''}</span>
            </div>
            {ncrList.length === 0 ? (
              <div className="py-14 flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-emerald-600">No reports found</p>
                <p className="text-xs text-emerald-400">Submitted reports will appear here once available</p>
              </div>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['NCR Number', 'Title', 'Severity', 'ISO Element', 'Date Raised'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold tracking-widest uppercase text-emerald-400 border-b border-emerald-100 bg-emerald-50/60">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ncrList.map((ncr) => (
                    <tr key={ncr.id} className="cursor-pointer hover:bg-emerald-50/60 transition-all" onClick={() => setSelectedNCR(ncr)}>
                      <td className="px-4 py-3 border-b border-emerald-50 text-sm font-semibold text-emerald-700">{ncr.ncr_number}</td>
                      <td className="px-4 py-3 border-b border-emerald-50 text-sm text-emerald-900">{ncr.title}</td>
                      <td className="px-4 py-3 border-b border-emerald-50 text-sm">
                        {ncr.severity ? (
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${ncr.severity === 'Major' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{ncr.severity}</span>
                        ) : <span className="text-emerald-400">—</span>}
                      </td>
                      <td className="px-4 py-3 border-b border-emerald-50 text-xs text-emerald-700 truncate max-w-xs">{ncr.iso_element || '—'}</td>
                      <td className="px-4 py-3 border-b border-emerald-50 text-sm text-emerald-600">{ncr.date_raised?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )
    )
  }

  /* ──────────────────────────────────────
     ADMIN / EDITOR MODE — full audit form
  ────────────────────────────────────── */
  return shell(
    <>
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400 mb-1">Internal Audit</p>
        <h1 className="text-2xl font-semibold text-emerald-950">New Non-Conformance Report</h1>
        <p className="text-sm text-emerald-500 mt-1">
          Logged in as <strong className="font-semibold text-emerald-700">{userEmail}</strong> · {role}
        </p>
      </div>

      {/* Main form card — sectioned to match the printed audit form */}
      <div className="bg-white border border-emerald-200 rounded-xl shadow-sm overflow-hidden">
        {/* Top: Audit Date / ISO Element */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-emerald-200">
          <div className="p-5 md:border-r border-emerald-200">
            <Field label="Audit Date">
              <input
                type="date"
                name="auditDate"
                value={form.auditDate}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
              />
            </Field>
          </div>
          <div className="p-5">
            <Field label="ISO Element">
              <IsoElementCombobox value={form.isoElement} onChange={(v) => setForm({ ...form, isoElement: v })} />
            </Field>
          </div>
        </div>

        {/* Description of Non-Conformance */}
        <SectionHeader>Description of the Non-Conformance</SectionHeader>
        <div className="p-5 space-y-4">
          <Field label="Severity">
            <SeverityToggle value={form.severity} onChange={(v) => setForm({ ...form, severity: v })} />
          </Field>
          <Field label="Title">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Brief title for this finding"
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the non-conformance in detail…"
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all resize-y"
            />
          </Field>
        </div>

        {/* Signatures: Auditor / Acknowledger (side by side, mirroring the PDF) */}
        <SectionHeader>Signatures</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-emerald-200">
          <div className="p-5 md:border-r border-emerald-200 space-y-4">
            <SignatureUpload label="Auditor Signature" file={auditorSig} onFileChange={setAuditorSig} />
            <Field label="Internal Auditors">
              <input
                name="internalAuditors"
                value={form.internalAuditors}
                onChange={handleChange}
                placeholder="e.g. JO / HM"
                className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
              />
            </Field>
          </div>
          <div className="p-5 space-y-4">
            <SignatureUpload label="Acknowledgment Signature" file={ackSig} onFileChange={setAckSig} />
            <Field label="Acknowledged By">
              <input
                name="acknowledgedBy"
                value={form.acknowledgedBy}
                onChange={handleChange}
                placeholder="e.g. Aamir Zahoor"
                className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
              />
            </Field>
          </div>
        </div>

        {/* Root Cause */}
        <SectionHeader>Determination of Root Cause</SectionHeader>
        <div className="p-5">
          <Field label="Root Cause">
            <textarea
              name="rootCause"
              value={form.rootCause}
              onChange={handleChange}
              placeholder="Identify the root cause…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all resize-y"
            />
          </Field>
        </div>

        {/* Corrective Action */}
        <SectionHeader>Corrective Action</SectionHeader>
        <div className="p-5 space-y-4">
          <Field label="Corrective Action">
            <textarea
              name="correctiveAction"
              value={form.correctiveAction}
              onChange={handleChange}
              placeholder="Describe corrective actions to be taken…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all resize-y"
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Agreed Due Date">
              <input
                name="agreedDueDate"
                value={form.agreedDueDate}
                onChange={handleChange}
                placeholder="e.g. Q2 2026 or 30 Jun 2026"
                className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
              />
            </Field>
            <Field label="Responsibility">
              <input
                name="responsibility"
                value={form.responsibility}
                onChange={handleChange}
                placeholder="e.g. Contracts / Procurement Department"
                className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
              />
            </Field>
          </div>
        </div>

        {/* Verification */}
        <SectionHeader>Verification of Corrective Action's Effectiveness</SectionHeader>
        <div className="p-5">
          <Field label="(Please attach evidence, results of action taken, actions completed)">
            <textarea
              name="verificationText"
              value={form.verificationText}
              onChange={handleChange}
              placeholder="Describe verification of corrective action effectiveness…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all resize-y"
            />
          </Field>
        </div>

        {/* Closure */}
        <SectionHeader>Closure</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          <Field label="Auditor Name & Signature">
            <input
              name="auditorName"
              value={form.auditorName}
              onChange={handleChange}
              placeholder="e.g. Jordain Opone / Harlene Manansala"
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
            />
          </Field>
          <Field label="Date Closed">
            <input
              name="dateClosed"
              value={form.dateClosed}
              onChange={handleChange}
              placeholder="e.g. In Progress, or 15 Mar 2026"
              className="w-full px-3 py-2.5 rounded-lg border border-emerald-200 bg-white text-sm text-emerald-900 placeholder-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition-all"
            />
          </Field>
        </div>
      </div>

      {/* Electronic signatures (workflow) — kept from your existing system */}
      <div className="bg-white border border-emerald-100 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center px-5 py-3.5 border-b border-emerald-100">
          <span className="text-sm font-semibold text-emerald-900">Electronic Signatures (Workflow)</span>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg">
            <div className="text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-2">Prepared By</div>
            {form.preparedBy ? (
              <div className="text-sm text-emerald-700">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckIcon className="w-3.5 h-3.5" /> Signed by <strong>{form.preparedBy}</strong>
                </span>
                <br />
                <span className="text-xs text-emerald-400">{form.preparedSignedAt ? new Date(form.preparedSignedAt).toLocaleString() : ''}</span>
              </div>
            ) : (canEdit && !form.preparedSignedAt) ? (
              <button type="button" onClick={signAsPrepared} className="mt-1 px-4 py-1.5 border border-emerald-300 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-all">
                Sign as Prepared By
              </button>
            ) : <div className="text-sm text-emerald-400 italic">Not yet signed</div>}
          </div>
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg">
            <div className="text-[11px] font-semibold tracking-widest uppercase text-emerald-500 mb-2">Approved By</div>
            {form.approvedBy ? (
              <div className="text-sm text-emerald-700">
                <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckIcon className="w-3.5 h-3.5" /> Signed by <strong>{form.approvedBy}</strong>
                </span>
                <br />
                <span className="text-xs text-emerald-400">{form.approvedSignedAt ? new Date(form.approvedSignedAt).toLocaleString() : ''}</span>
              </div>
            ) : (isAdmin && !!form.preparedSignedAt && !form.approvedSignedAt) ? (
              <button type="button" onClick={signAsApproved} className="mt-1 px-4 py-1.5 border border-emerald-300 text-emerald-700 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-all">
                Sign & Approve NCR
              </button>
            ) : <div className="text-sm text-emerald-400 italic">{form.preparedSignedAt ? 'Awaiting admin approval' : 'Awaiting prepared signature'}</div>}
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={submitNCR}
          disabled={submitting}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {submitting ? 'Saving…' : 'Save NCR'}
        </button>
      </div>
    </>
  )
}
