import { describe, it, expect } from 'vitest'

describe('Ejemplo b�sico', () => {
  it('deber�a pasar este test simple', () => {
    expect(1 + 1).toBe(2)
  })

  it('deber�a verificar strings', () => {
    const nombre = 'Promptraits'
    expect(nombre).toBe('Promptraits')
  })

  it('deber�a verificar arrays', () => {
    const numeros = [1, 2, 3, 4, 5]
    expect(numeros).toHaveLength(5)
    expect(numeros).toContain(3)
  })
})