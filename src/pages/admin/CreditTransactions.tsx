import { useState, useEffect } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useCreditTransactions } from '../../hooks'
import { SkeletonClientRow, skeletonStyles } from '../../components/SkeletonLoader'
import { getUser } from '../../lib/auth'
import type {
  TransactionType,
  CreditTransaction,
  PaymentStatus,
  PaymentInitType,
  PaymentMethod,
  InitializePaymentRequest,
} from '../../types/credit-transaction.types'
import { creditTransactionService } from '../../services/credit-transaction.service'

const TRANSACTION_TYPES: Record<TransactionType, { label: string; bg: string; border: string; color: string }> = {
  topup: { label: 'Top-up', bg: 'rgba(39,174,96,0.12)', border: 'rgba(39,174,96,0.25)', color: 'hsl(152,60%,50%)' },
  deduction: {
    label: 'Deduction',
    bg: 'rgba(231,76,60,0.12)',
    border: 'rgba(231,76,60,0.25)',
    color: 'hsl(0,62%,60%)',
  },
  bonus: { label: 'Bonus', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', color: 'hsl(260,60%,65%)' },
  refund: { label: 'Refund', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', color: 'hsl(217,92%,65%)' },
}

const PAYMENT_STATUSES: Record<PaymentStatus, { label: string; bg: string; border: string; color: string }> = {
  COMPLETED: {
    label: 'Completed',
    bg: 'rgba(39,174,96,0.12)',
    border: 'rgba(39,174,96,0.25)',
    color: 'hsl(152,60%,50%)',
  },
  PENDING: { label: 'Pending', bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.25)', color: 'hsl(25,97%,53%)' },
  FAILED: { label: 'Failed', bg: 'rgba(231,76,60,0.12)', border: 'rgba(231,76,60,0.25)', color: 'hsl(0,62%,60%)' },
}

const CHANNELS: Record<string, string> = {
  EMAIL: 'mail',
  SMS: 'sms',
  PUSH: 'bell',
  IN_APP: 'layers',
}

interface PaymentForm {
  targetAccountId: string
  type: PaymentInitType
  amount: string
  currency: string
  method: PaymentMethod
  planId: string
  templateId: string
  appId: string
  customerName: string
  email: string
  phoneNumber: string
}

function PaymentInitModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState<PaymentForm>({
    targetAccountId: '',
    type: 'payg_topup',
    amount: '',
    currency: 'USD',
    method: 'card',
    planId: '',
    templateId: '',
    appId: '',
    customerName: '',
    email: '',
    phoneNumber: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.targetAccountId || !form.amount) {
      setError('Account ID and amount are required')
      return
    }

    if (form.type === 'subscription' && !form.planId) {
      setError('Plan ID is required for subscriptions')
      return
    }

    if (form.type === 'template_purchase' && (!form.templateId || !form.appId)) {
      setError('Template ID and App ID are required for template purchases')
      return
    }

    setLoading(true)
    try {
      const payload: InitializePaymentRequest = {
        targetAccountId: form.targetAccountId,
        type: form.type,
        amount: Number.parseFloat(form.amount),
        currency: form.currency,
        method: form.method,
        ...(form.type === 'subscription' && { planId: form.planId }),
        ...(form.type === 'template_purchase' && {
          templateId: form.templateId,
          appId: form.appId,
        }),
        ...(form.customerName && { customerName: form.customerName }),
        ...(form.email && { email: form.email }),
        ...(form.phoneNumber && { phoneNumber: form.phoneNumber }),
      }

      const adminUser = getUser()
      if (!adminUser?.id) {
        throw new Error('Admin account ID not found')
      }

      await creditTransactionService.initializePayment(payload, adminUser.id)
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
        onClose()
        setForm({
          targetAccountId: '',
          type: 'payg_topup',
          amount: '',
          currency: 'USD',
          method: 'card',
          planId: '',
          templateId: '',
          appId: '',
          customerName: '',
          email: '',
          phoneNumber: '',
        })
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 50,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'hsl(224,18%,8%)',
          border: '1px solid hsl(224,14%,14%)',
          borderRadius: 12,
          width: 'min(500px, calc(100vw - 32px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 51,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid hsl(224,14%,12%)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            background: 'hsl(224,18%,8%)',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'hsl(210,20%,95%)', margin: 0 }}>Initialize Payment</h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="x" size={18} color="hsl(215,15%,55%)" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {success && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(39,174,96,0.12)',
                border: '1px solid rgba(39,174,96,0.25)',
                borderRadius: 8,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Icon name="check" size={16} color="hsl(152,60%,50%)" />
              <span style={{ color: 'hsl(152,60%,50%)', fontSize: 13, fontWeight: 500 }}>
                Payment initialized successfully!
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(231,76,60,0.12)',
                border: '1px solid rgba(231,76,60,0.25)',
                borderRadius: 8,
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Icon name="x" size={16} color="hsl(0,62%,60%)" />
              <span style={{ color: 'hsl(0,62%,60%)', fontSize: 13, fontWeight: 500 }}>{error}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label
                style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 6 }}
              >
                Target Account ID *
              </label>
              <input
                type="text"
                value={form.targetAccountId}
                onChange={(e) => setForm({ ...form, targetAccountId: e.target.value })}
                placeholder="Enter account ID"
                style={{
                  width: '100%',
                  background: 'hsl(224,14%,10%)',
                  border: '1px solid hsl(224,14%,16%)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: 'hsl(210,20%,85%)',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
              />
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 6 }}
              >
                Payment Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PaymentInitType })}
                style={{
                  width: '100%',
                  background: 'hsl(224,14%,10%)',
                  border: '1px solid hsl(224,14%,16%)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: 'hsl(210,20%,85%)',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="payg_topup">Pay-As-You-Go Top-up</option>
                <option value="subscription">Subscription</option>
                <option value="template_purchase">Template Purchase</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'hsl(210,20%,85%)',
                    marginBottom: 6,
                  }}
                >
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    background: 'hsl(224,14%,10%)',
                    border: '1px solid hsl(224,14%,16%)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                    color: 'hsl(210,20%,85%)',
                    fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'hsl(210,20%,85%)',
                    marginBottom: 6,
                  }}
                >
                  Currency
                </label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
                  placeholder="USD"
                  maxLength={3}
                  style={{
                    width: '100%',
                    background: 'hsl(224,14%,10%)',
                    border: '1px solid hsl(224,14%,16%)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                    color: 'hsl(210,20%,85%)',
                    fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                    textTransform: 'uppercase',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                />
              </div>
            </div>

            <div>
              <label
                style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 6 }}
              >
                Payment Method *
              </label>
              <select
                value={form.method}
                onChange={(e) => setForm({ ...form, method: e.target.value as PaymentMethod })}
                style={{
                  width: '100%',
                  background: 'hsl(224,14%,10%)',
                  border: '1px solid hsl(224,14%,16%)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  fontSize: 13,
                  color: 'hsl(210,20%,85%)',
                  fontFamily: 'Manrope, sans-serif',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>

            {form.type === 'subscription' && (
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'hsl(210,20%,85%)',
                    marginBottom: 6,
                  }}
                >
                  Plan ID *
                </label>
                <input
                  type="text"
                  value={form.planId}
                  onChange={(e) => setForm({ ...form, planId: e.target.value })}
                  placeholder="e.g., plan-pro-monthly"
                  style={{
                    width: '100%',
                    background: 'hsl(224,14%,10%)',
                    border: '1px solid hsl(224,14%,16%)',
                    borderRadius: 8,
                    padding: '10px 12px',
                    fontSize: 13,
                    color: 'hsl(210,20%,85%)',
                    fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                />
              </div>
            )}

            {form.type === 'template_purchase' && (
              <>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'hsl(210,20%,85%)',
                      marginBottom: 6,
                    }}
                  >
                    Template ID *
                  </label>
                  <input
                    type="text"
                    value={form.templateId}
                    onChange={(e) => setForm({ ...form, templateId: e.target.value })}
                    placeholder="e.g., tpl-welcome-email"
                    style={{
                      width: '100%',
                      background: 'hsl(224,14%,10%)',
                      border: '1px solid hsl(224,14%,16%)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 13,
                      color: 'hsl(210,20%,85%)',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'hsl(210,20%,85%)',
                      marginBottom: 6,
                    }}
                  >
                    App ID *
                  </label>
                  <input
                    type="text"
                    value={form.appId}
                    onChange={(e) => setForm({ ...form, appId: e.target.value })}
                    placeholder="e.g., app-123"
                    style={{
                      width: '100%',
                      background: 'hsl(224,14%,10%)',
                      border: '1px solid hsl(224,14%,16%)',
                      borderRadius: 8,
                      padding: '10px 12px',
                      fontSize: 13,
                      color: 'hsl(210,20%,85%)',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                  />
                </div>
              </>
            )}

            <div style={{ borderTop: '1px solid hsl(224,14%,12%)', paddingTop: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(215,15%,55%)', marginBottom: 12 }}>
                Optional Details
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'hsl(210,20%,85%)',
                      marginBottom: 4,
                    }}
                  >
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      background: 'hsl(224,14%,10%)',
                      border: '1px solid hsl(224,14%,16%)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 13,
                      color: 'hsl(210,20%,85%)',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'hsl(210,20%,85%)',
                      marginBottom: 4,
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    style={{
                      width: '100%',
                      background: 'hsl(224,14%,10%)',
                      border: '1px solid hsl(224,14%,16%)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 13,
                      color: 'hsl(210,20%,85%)',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'hsl(210,20%,85%)',
                      marginBottom: 4,
                    }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    placeholder="+1234567890"
                    style={{
                      width: '100%',
                      background: 'hsl(224,14%,10%)',
                      border: '1px solid hsl(224,14%,16%)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      fontSize: 13,
                      color: 'hsl(210,20%,85%)',
                      fontFamily: 'Manrope, sans-serif',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                background: 'hsl(224,14%,10%)',
                border: '1px solid hsl(224,14%,16%)',
                color: 'hsl(210,20%,85%)',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                background: C.primary,
                border: 'none',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Processing...' : 'Initialize Payment'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Badge({ label, colors }: { label: string; colors: { bg: string; border: string; color: string } }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: 6,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: 12,
        fontWeight: 600,
        color: colors.color,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string | number
  icon: string
  color: string
}) {
  return (
    <div
      className="card-padding"
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={18} color={color} />
      </div>
      <div>
        <p style={{ fontSize: 12, color: 'hsl(215,15%,55%)', marginBottom: 4 }}>{title}</p>
        <p className="stat-value" style={{ fontWeight: 700, color: 'hsl(210,20%,95%)' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

function TransactionRow({ tx, idx, total }: { tx: CreditTransaction; idx: number; total: number }) {
  const typeColors = TRANSACTION_TYPES[tx.type]
  const isPositive = tx.amount > 0

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 1fr 0.7fr 80px',
        gap: 16,
        padding: '14px 20px',
        borderBottom: idx < total - 1 ? '1px solid hsl(224,14%,11%)' : 'none',
        alignItems: 'center',
        fontSize: 12,
        minWidth: 1100,
      }}
    >
      <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)', fontFamily: 'monospace' }}>
        {tx.transactionId.slice(0, 8)}...
      </p>

      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 2 }}>{tx.accountName}</p>
        <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)' }}>{tx.accountEmail}</p>
      </div>

      <Badge label={typeColors.label} colors={typeColors} />

      <p style={{ fontSize: 13, fontWeight: 600, color: isPositive ? 'hsl(152,60%,50%)' : 'hsl(0,62%,60%)' }}>
        {isPositive ? '+' : ''} ${tx.amount.toFixed(2)}
      </p>

      <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>${tx.balanceAfter.toFixed(2)}</p>

      {tx.channel ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name={CHANNELS[tx.channel] || 'bell'} size={12} color="hsl(215,15%,55%)" />
          <span style={{ color: 'hsl(215,15%,55%)' }}>{tx.channel}</span>
        </div>
      ) : (
        <span style={{ color: 'hsl(215,15%,45%)' }}>—</span>
      )}

      {tx.bonusPercent ? (
        <span style={{ color: 'hsl(260,60%,65%)', fontWeight: 600 }}>{tx.bonusPercent}%</span>
      ) : (
        <span style={{ color: 'hsl(215,15%,45%)' }}>—</span>
      )}

      <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)' }}>{new Date(tx.createdAt).toLocaleDateString()}</p>

      <div>
        {tx.status && PAYMENT_STATUSES[tx.status as PaymentStatus] ? (
          <Badge
            label={PAYMENT_STATUSES[tx.status as PaymentStatus].label}
            colors={PAYMENT_STATUSES[tx.status as PaymentStatus]}
          />
        ) : (
          <span style={{ color: 'hsl(215,15%,45%)', fontSize: 11 }}>—</span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tx.isCompleted ? (
          <Icon name="check" size={14} color="hsl(152,60%,50%)" />
        ) : (
          <Icon name="x" size={14} color="hsl(0,62%,60%)" />
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        <button
          title="View details"
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'hsl(224,14%,13%)',
            border: '1px solid hsl(224,14%,18%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.35)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,18%)')}
        >
          <Icon name="eye" size={13} color="hsl(215,15%,55%)" />
        </button>
      </div>
    </div>
  )
}

export default function CreditTransactions() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const limit = 20

  useEffect(() => {
    setPage(1)
  }, [search, typeFilter, statusFilter])

  const params = {
    search: search || undefined,
    type: typeFilter !== 'all' ? (typeFilter as TransactionType) : undefined,
    status: statusFilter !== 'all' ? (statusFilter as PaymentStatus) : undefined,
    page,
    limit,
  }

  const { data: response, isLoading, isError, error, isFetching, refetch } = useCreditTransactions(params)

  const transactions = response?.data || []
  const summary = response?.summary || {
    totalAmount: 0,
    countByType: { topup: 0, deduction: 0, bonus: 0, refund: 0 },
    dateRange: { from: '', to: '' },
  }
  const meta = response?.meta || { total: 0, page: 1, pageSize: 20, totalPages: 1 }

  if (isError) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ color: 'hsl(0,62%,60%)', fontSize: 14 }}>
          Error loading transactions: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <style>{skeletonStyles}</style>

      <PaymentInitModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <div className="responsive-header" style={{ marginBottom: 28 }}>
        <div>
          <h1
            className="page-title"
            style={{ fontWeight: 700, color: 'hsl(210,20%,95%)', letterSpacing: '-0.02em', marginBottom: 4 }}
          >
            Credit Transactions
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Track and audit all credit transactions</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => setPaymentModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: 'hsl(152,60%,50%)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(39,174,96,0.3)',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <Icon name="send" size={15} color="#fff" />
            Initialize Payment
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '9px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              background: C.primary,
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(2,147,228,0.3)',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="download" size={15} color="#fff" />
            Export
          </button>
        </div>
      </div>

      {!isLoading && (
        <div className="responsive-grid-4" style={{ marginBottom: 28 }}>
          <SummaryCard
            title="Total Volume"
            value={`$${summary.totalAmount.toFixed(2)}`}
            icon="activity"
            color="#36A9EA"
          />
          <SummaryCard title="Top-ups" value={summary.countByType.topup} icon="arrow-up" color="hsl(152,60%,50%)" />
          <SummaryCard title="Deductions" value={summary.countByType.deduction} icon="minus" color="hsl(0,62%,60%)" />
          <SummaryCard title="Bonuses" value={summary.countByType.bonus} icon="gift" color="hsl(260,60%,65%)" />
        </div>
      )}

      <div className="responsive-filters" style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <div style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)' }}>
            <Icon name="search" size={14} color="hsl(215,15%,50%)" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, ref, or account..."
            style={{
              width: '100%',
              background: 'hsl(224,14%,10%)',
              border: '1px solid hsl(224,14%,16%)',
              borderRadius: 8,
              padding: '8px 12px 8px 34px',
              fontSize: 13,
              color: 'hsl(210,20%,85%)',
              fontFamily: 'Manrope, sans-serif',
              outline: 'none',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(2,147,228,0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'hsl(224,14%,16%)')}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            background: 'hsl(224,14%,10%)',
            border: '1px solid hsl(224,14%,16%)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            color: 'hsl(210,20%,85%)',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
            cursor: 'pointer',
            minWidth: 140,
          }}
        >
          <option value="all">All Types</option>
          <option value="topup">Top-up</option>
          <option value="deduction">Deduction</option>
          <option value="bonus">Bonus</option>
          <option value="refund">Refund</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: 'hsl(224,14%,10%)',
            border: '1px solid hsl(224,14%,16%)',
            borderRadius: 8,
            padding: '8px 12px',
            fontSize: 13,
            color: 'hsl(210,20%,85%)',
            fontFamily: 'Manrope, sans-serif',
            outline: 'none',
            cursor: 'pointer',
            minWidth: 140,
          }}
        >
          <option value="all">All Statuses</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div
        style={{
          background: 'hsl(224,18%,8%)',
          border: '1px solid hsl(224,14%,14%)',
          borderRadius: 12,
          overflow: 'hidden',
          position: 'relative',
          minHeight: 300,
        }}
      >
        <div className="responsive-table-wrapper">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 1fr 0.7fr 80px',
              gap: 16,
              padding: '12px 20px',
              borderBottom: '1px solid hsl(224,14%,12%)',
              background: 'hsl(224,14%,10%)',
              minWidth: 1100,
            }}
          >
            {[
              'Transaction ID',
              'Account',
              'Type',
              'Amount',
              'Balance',
              'Channel',
              'Bonus %',
              'Date',
              'Payment Status',
              'Completed',
              'Actions',
            ].map((h) => (
              <div
                key={h}
                style={{ fontSize: 11, fontWeight: 600, color: 'hsl(215,15%,50%)', textTransform: 'uppercase' }}
              >
                {h}
              </div>
            ))}
          </div>

          {transactions.map((tx, idx) => (
            <TransactionRow key={tx.transactionId} tx={tx} idx={idx} total={transactions.length} />
          ))}

          {transactions.length === 0 && !isLoading && (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Icon name="search" size={32} color="hsl(215,15%,35%)" />
              <p style={{ color: 'hsl(215,15%,50%)', marginTop: 12, fontSize: 14 }}>
                {search ? 'No transactions match your search' : 'No transactions found'}
              </p>
            </div>
          )}

          {isLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {Array.from({ length: limit }).map((_, i) => (
                <SkeletonClientRow key={i} showOrganizations={false} />
              ))}
            </div>
          )}
        </div>
      </div>

      {!isLoading && transactions.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)' }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total)} of {meta.total} transactions
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage(Math.max(1, page - 1))}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                background: page === 1 ? 'hsl(224,14%,10%)' : 'hsl(224,14%,12%)',
                border: '1px solid hsl(224,14%,16%)',
                color: 'hsl(215,15%,55%)',
                fontSize: 13,
                fontWeight: 600,
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              Prev
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
              const pageNum = Math.max(1, page - 2) + i
              return pageNum <= meta.totalPages ? pageNum : null
            })
              .filter(Boolean)
              .map((p) => (
                <button
                  key={p}
                  disabled={isFetching}
                  onClick={() => setPage(p)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    background: p === page ? 'rgba(2,147,228,0.15)' : 'hsl(224,14%,10%)',
                    border: `1px solid ${p === page ? 'rgba(2,147,228,0.3)' : 'hsl(224,14%,16%)'}`,
                    color: p === page ? '#36A9EA' : 'hsl(215,15%,55%)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: isFetching ? 'not-allowed' : 'pointer',
                    opacity: isFetching ? 0.5 : 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {p}
                </button>
              ))}
            <button
              disabled={page === meta.totalPages || isFetching}
              onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                background: page === meta.totalPages ? 'hsl(224,14%,10%)' : 'hsl(224,14%,12%)',
                border: '1px solid hsl(224,14%,16%)',
                color: 'hsl(215,15%,55%)',
                fontSize: 13,
                fontWeight: 600,
                cursor: page === meta.totalPages ? 'not-allowed' : 'pointer',
                opacity: page === meta.totalPages ? 0.5 : 1,
                transition: 'all 0.15s',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
