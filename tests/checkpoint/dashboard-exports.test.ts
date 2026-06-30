// Checkpoint verification test for app/utils/dashboard.ts
// Verifies all functions and types are exported correctly

import { describe, it, expect } from 'vitest'
import {
  calcularPeriodoRange,
  buildAtividadeFeed,
  calcularAlertas,
} from '../../app/utils/dashboard'

// Type imports - if these compile, the types are exported correctly
import type {
  PeriodoFiltro,
  PeriodoRange,
  AtividadeItem,
  RawEvent,
  AlertasInput,
  AlertasDashboard,
} from '../../app/utils/dashboard'

describe('Checkpoint: dashboard.ts exports', () => {
  it('exports calcularPeriodoRange as a function', () => {
    expect(typeof calcularPeriodoRange).toBe('function')
  })

  it('exports buildAtividadeFeed as a function', () => {
    expect(typeof buildAtividadeFeed).toBe('function')
  })

  it('exports calcularAlertas as a function', () => {
    expect(typeof calcularAlertas).toBe('function')
  })

  it('calcularPeriodoRange returns valid PeriodoRange', () => {
    const result: PeriodoRange = calcularPeriodoRange('mes_atual', { mes: 1, ano: 2024 }, new Date(2024, 5, 15))
    expect(result).toHaveProperty('inicio')
    expect(result).toHaveProperty('fim')
    expect(typeof result.inicio).toBe('string')
    expect(typeof result.fim).toBe('string')
  })

  it('buildAtividadeFeed returns AtividadeItem[]', () => {
    const events: RawEvent[] = [
      { id: 1, tipo: 'orcamento_criado', descricao: 'Test', clienteNome: 'Cliente', criadoEm: '2024-01-01T00:00:00Z' }
    ]
    const result: AtividadeItem[] = buildAtividadeFeed(events)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(1)
  })

  it('calcularAlertas returns AlertasDashboard', () => {
    const input: AlertasInput = {
      orcamentosEnviados: [],
      contasVencidas: [],
      osComPrazo: [],
    }
    const result: AlertasDashboard = calcularAlertas(input, new Date(2024, 5, 15))
    expect(result).toHaveProperty('orcamentosExpirando')
    expect(result).toHaveProperty('contasVencidas')
    expect(result).toHaveProperty('valorContasVencidas')
    expect(result).toHaveProperty('osAtrasadas')
    expect(result).toHaveProperty('temAlertas')
  })

  // Type verification - these ensure type exports work at compile time
  it('PeriodoFiltro type accepts valid values', () => {
    const filtros: PeriodoFiltro[] = ['mes_atual', 'semana_atual', 'trimestre_atual', 'ano_atual', 'personalizado']
    expect(filtros.length).toBe(5)
  })
})
