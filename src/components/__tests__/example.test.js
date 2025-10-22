import { describe, it, expect } from 'vitest'

describe('Ejemplo básico', () => {
  it('debería pasar este test simple', () => {
    expect(1 + 1).toBe(2)
  })

  it('debería verificar strings', () => {
    const nombre = 'Promptraits'
    expect(nombre).toBe('Promptraits')
  })

  it('debería verificar arrays', () => {
    const numeros = [1, 2, 3, 4, 5]
    expect(numeros).toHaveLength(5)
    expect(numeros).toContain(3)
  })
})