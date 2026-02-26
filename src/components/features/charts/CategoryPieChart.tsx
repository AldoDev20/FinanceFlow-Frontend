'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

interface CategoryPieChartProps {
  data: any[]
}

const COLORS = [
  'var(--growth)',
  'var(--expense)',
  'var(--accent)',
  '#b49a6a', // Desaturated Gold
  '#7a6a9e', // Desaturated Purple
  '#c48b8b', // Desaturated Rose
]

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const hasData = data && data.length > 0 && data.some(d => d.value > 0)

  return (
    <div className="h-[300px] w-full relative">
      {!hasData && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-canvas/40 backdrop-blur-[2px] rounded-3xl">
          <div className="p-4 bg-surface-2 rounded-full mb-3 shadow-inner">
            <PieChart className="h-6 w-6 text-ink-muted" />
          </div>
          <p className="text-sm font-medium text-ink-secondary text-center">Sin gastos registrados</p>
          <p className="text-xs text-ink-muted text-center max-w-[200px] mt-1">
            Categoriza tus consumos para visualizar tu balance.
          </p>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={hasData ? data : [{ name: 'Vacío', value: 1 }]}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
            stroke="var(--surface-1)"
            strokeWidth={2}
          >
            {hasData ? (
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            ) : (
              <Cell fill="var(--surface-3)" />
            )}
          </Pie>
          {hasData && (
            <>
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
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => <span className="text-[10px] font-bold uppercase tracking-widest text-ink-muted px-2">{value}</span>}
              />
            </>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
