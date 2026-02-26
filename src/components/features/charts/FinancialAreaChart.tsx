'use client'

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { TrendingUp } from 'lucide-react'

interface FinancialAreaChartProps {
  data: any[]
}

export function FinancialAreaChart({ data }: FinancialAreaChartProps) {
  const hasData = data && data.length > 0 && data.some(d => d.ingresos > 0 || d.gastos > 0)

  return (
    <div className="h-[300px] w-full relative">
      {!hasData && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-canvas/40 backdrop-blur-[2px] rounded-xl">
          <div className="p-4 bg-surface-2 rounded-full mb-3">
            <TrendingUp className="h-6 w-6 text-ink-muted" />
          </div>
          <p className="text-sm font-medium text-ink-secondary text-center">No hay datos suficientes</p>
          <p className="text-xs text-ink-muted text-center max-w-[200px] mt-1">
            Registra tus ingresos y gastos para ver tu evolución.
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={hasData ? data : []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--growth)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--growth)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.15} />
              <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border-subtle)" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--ink-muted)', fontSize: 10, fontWeight: 500 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--ink-muted)', fontSize: 10, fontWeight: 500 }}
            tickFormatter={(value: number) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--surface-1)', 
              border: '1px solid var(--border-strong)',
              borderRadius: '4px',
              fontSize: '11px',
              color: 'var(--ink-primary)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
              padding: '8px 12px'
            }}
            labelStyle={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: '4px', fontSize: '12px' }}
            itemStyle={{ color: 'var(--ink-primary)', padding: '2px 0' }}
            formatter={(value: any) => [
              <span key="amount" className="font-display font-medium text-sm">${Number(value).toLocaleString()}</span>,
              null
            ]}
          />
          <Area
            type="monotone"
            dataKey="ingresos"
            stroke="var(--growth)"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorGrowth)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="gastos"
            stroke="var(--expense)"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#colorExpense)"
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
