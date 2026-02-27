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
    <div className="flex flex-col md:flex-row gap-6 mb-10">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
        <Input 
          placeholder="Buscar por descripción o categoría..." 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-12"
        />
        {search && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary p-1 bg-surface-3/50 rounded-full transition-all"
          >
            <X size={14} />
          </button>
        )}
      </div>
      
      <div className="flex gap-4">
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[160px] h-11 rounded-xl bg-surface-2/40 backdrop-blur-sm border-border-subtle px-4">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent className="glass-card border-border-strong">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="income">Ingresos</SelectItem>
            <SelectItem value="expense">Gastos</SelectItem>
            <SelectItem value="transfer">Transferencias</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onClear}
          className="px-6"
        >
          <SlidersHorizontal size={16} className="mr-2" />
          Limpiar
        </Button>
      </div>
    </div>
  )
}
