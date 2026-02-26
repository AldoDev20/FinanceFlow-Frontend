'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface TransactionFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  onClear: () => void
}

export function TransactionFilters({ 
  search, 
  onSearchChange, 
  type, 
  onTypeChange,
  onClear 
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        <Input 
          placeholder="Buscar por descripción o categoría..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-surface-2 border-border-subtle rounded-xl h-11 focus:ring-growth/20 focus:border-growth"
        />
        {search && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="flex gap-3">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[140px] bg-surface-2 border-border-subtle rounded-xl h-11">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="bg-surface-1 border-border-strong">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Ingresos</SelectItem>
            <SelectItem value="expense">Gastos</SelectItem>
            <SelectItem value="transfer">Transferencias</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onClear}
          className="h-11 rounded-xl border-border-strong text-ink-primary gap-2"
        >
          <SlidersHorizontal size={18} />
          Limpiar
        </Button>
      </div>
    </div>
  )
}
