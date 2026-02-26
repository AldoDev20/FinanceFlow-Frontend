'use client'

import { useState, useEffect, Suspense } from 'react'
import { Plus, FileDown, FileText, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TransactionList } from '@/components/features/transactions/TransactionList'
import { TransactionFilters } from '@/components/features/transactions/TransactionFilters'
import { useTransactions, useDownloadPDF, useDownloadExcel } from '@/hooks/useTransactions'

function TransactionsContent() {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') || ''
  
  const [search, setSearch] = useState(initialSearch)
  const [type, setType] = useState('all')

  useEffect(() => {
    const query = searchParams.get('search')
    if (query !== null) {
      setSearch(query)
    }
  }, [searchParams])

  const { data: transactions, isLoading } = useTransactions({
    type: type === 'all' ? undefined : type as any,
  })

  const { mutate: downloadPDF, isPending: isDownloadingPDF } = useDownloadPDF()
  const { mutate: downloadExcel, isPending: isDownloadingExcel } = useDownloadExcel()

  const filters = {
    type: type === 'all' ? undefined : type as any,
  }

  // Basic client-side search filtering until API search is implemented
  const filteredTransactions = transactions?.filter(t => 
    t.description?.toLowerCase().includes(search.toLowerCase()) || 
    t.category.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-growth/5 blur-[120px] rounded-full pointer-events-none" />
        <div>
          <h1 className="text-4xl font-display font-medium tracking-tight text-ink-primary">Movimientos</h1>
          <p className="text-ink-secondary mt-2 max-w-prose leading-relaxed">Historial detallado de todas tus operaciones financieras.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => downloadPDF(filters)} 
            disabled={isDownloadingPDF}
            className="border-border-subtle hover:bg-surface-2 rounded-xl h-11"
          >
            {isDownloadingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
            PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={() => downloadExcel(filters)} 
            disabled={isDownloadingExcel}
            className="border-border-subtle hover:bg-surface-2 rounded-xl h-11"
          >
            {isDownloadingExcel ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
            Excel
          </Button>
          <Link href="/transactions/new">
            <Button className="bg-growth hover:bg-growth/90 text-white rounded-xl shadow-md shadow-growth/10 h-11 px-6">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Transacción
            </Button>
          </Link>
        </div>
      </div>

      <div className="card-layer p-6 border-none rounded-2xl shadow-sm">
        <TransactionFilters 
          search={search}
          onSearchChange={setSearch}
          type={type}
          onTypeChange={setType}
          onClear={() => {
            setSearch('')
            setType('all')
          }}
        />
        <TransactionList transactions={filteredTransactions} isLoading={isLoading} />
      </div>
    </motion.div>
  )
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-ink-muted" /></div>}>
      <TransactionsContent />
    </Suspense>
  )
}
