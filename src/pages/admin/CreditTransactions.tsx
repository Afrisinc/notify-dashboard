import { useState, useEffect } from 'react'
import Icon from '../../components/Icon'
import { C } from '../../design'
import { useCreditTransactions } from '../../hooks'
import { SkeletonClientRow, skeletonStyles } from '../../components/SkeletonLoader'
import type { TransactionType, Channel, CreditTransaction } from '../../types/credit-transaction.types'

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

const CHANNELS: Record<string, string> = {
  EMAIL: 'mail',
  SMS: 'sms',
  PUSH: 'bell',
  IN_APP: 'layers',
}

function Badge({ label, colors }: { label: string; colors: Record<string, string> }) {
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
      style={{
        background: 'hsl(224,18%,8%)',
        border: '1px solid hsl(224,14%,14%)',
        borderRadius: 12,
        padding: '20px 24px',
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
        <p style={{ fontSize: 20, fontWeight: 700, color: 'hsl(210,20%,95%)' }}>{value}</p>
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
      }}
    >
      {/* Transaction ID */}
      <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)', fontFamily: 'monospace' }}>
        {tx.transactionId.slice(0, 8)}...
      </p>

      {/* Account */}
      <div>
        <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)', marginBottom: 2 }}>{tx.accountName}</p>
        <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)' }}>{tx.accountEmail}</p>
      </div>

      {/* Type */}
      <Badge label={typeColors.label} colors={typeColors} />

      {/* Amount */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: isPositive ? 'hsl(152,60%,50%)' : 'hsl(0,62%,60%)',
        }}
      >
        {isPositive ? '+' : ''} ${tx.amount.toFixed(2)}
      </p>

      {/* Balance After */}
      <p style={{ fontSize: 12, fontWeight: 600, color: 'hsl(210,20%,85%)' }}>${tx.balanceAfter.toFixed(2)}</p>

      {/* Channel */}
      {tx.channel ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name={CHANNELS[tx.channel] || 'bell'} size={12} color="hsl(215,15%,55%)" />
          <span style={{ color: 'hsl(215,15%,55%)' }}>{tx.channel}</span>
        </div>
      ) : (
        <span style={{ color: 'hsl(215,15%,45%)' }}>—</span>
      )}

      {/* Bonus % */}
      {tx.bonusPercent ? (
        <span style={{ color: 'hsl(260,60%,65%)', fontWeight: 600 }}>{tx.bonusPercent}%</span>
      ) : (
        <span style={{ color: 'hsl(215,15%,45%)' }}>—</span>
      )}

      {/* Date */}
      <p style={{ fontSize: 11, color: 'hsl(215,15%,55%)' }}>{new Date(tx.createdAt).toLocaleDateString()}</p>

      {/* Payment Status */}
      <div>
        {tx.paymentStatus ? (
          <Badge
            label={tx.paymentStatus}
            colors={{
              bg: 'rgba(39,174,96,0.12)',
              border: 'rgba(39,174,96,0.25)',
              color: 'hsl(152,60%,50%)',
            }}
          />
        ) : (
          <span style={{ color: 'hsl(215,15%,45%)', fontSize: 11 }}>—</span>
        )}
      </div>

      {/* Completed */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tx.isCompleted ? (
          <Icon name="check" size={14} color="hsl(152,60%,50%)" />
        ) : (
          <Icon name="x" size={14} color="hsl(0,62%,60%)" />
        )}
      </div>

      {/* Actions */}
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
  const [page, setPage] = useState(1)
  const limit = 20

  useEffect(() => {
    setPage(1)
  }, [search, typeFilter])

  const params = {
    search: search || undefined,
    type: typeFilter !== 'all' ? (typeFilter as TransactionType) : undefined,
    page,
    limit,
  }

  const { data: response, isLoading, isError, error, isFetching } = useCreditTransactions(params)

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

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: 'hsl(210,20%,95%)',
              letterSpacing: '-0.02em',
              marginBottom: 4,
            }}
          >
            Credit Transactions
          </h1>
          <p style={{ fontSize: 14, color: 'hsl(215,15%,55%)' }}>Track and audit all credit transactions</p>
        </div>
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
          }}
        >
          <Icon name="download" size={15} color="#fff" />
          Export
        </button>
      </div>

      {/* Summary Cards */}
      {!isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          <SummaryCard
            title="Total Volume"
            value={`$${summary.totalAmount.toFixed(2)}`}
            icon="trending-up"
            color="#36A9EA"
          />
          <SummaryCard title="Top-ups" value={summary.countByType.topup} icon="arrow-up" color="hsl(152,60%,50%)" />
          <SummaryCard title="Deductions" value={summary.countByType.deduction} icon="minus" color="hsl(0,62%,60%)" />
          <SummaryCard title="Bonuses" value={summary.countByType.bonus} icon="gift" color="hsl(260,60%,65%)" />
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
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
          }}
        >
          <option value="all">All Types</option>
          <option value="topup">Top-up</option>
          <option value="deduction">Deduction</option>
          <option value="bonus">Bonus</option>
          <option value="refund">Refund</option>
        </select>
      </div>

      {/* Table */}
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
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.8fr 1.2fr 1fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr 1fr 0.7fr 80px',
            gap: 16,
            padding: '12px 20px',
            borderBottom: '1px solid hsl(224,14%,12%)',
            background: 'hsl(224,14%,10%)',
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

        {/* Rows */}
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

      {/* Footer */}
      {!isLoading && transactions.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          <p style={{ fontSize: 13, color: 'hsl(215,15%,50%)' }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, meta.total)} of {meta.total} transactions
          </p>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage(Math.max(1, page - 1))}
              style={{
                width: 32,
                height: 32,
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
              ← Prev
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
                width: 32,
                height: 32,
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
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
