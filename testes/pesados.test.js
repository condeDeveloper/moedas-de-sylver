// Genero 23 e 24 (~20 s) e a conferencia ate o genero 12.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { porGenero, conferencia } from '../src/medidas.js'

test('generos 23 e 24: 26.183 de 170.963 e 13.911 de 282.828', { timeout: 600000 }, () => {
  const t = porGenero(24)
  assert.deepEqual([t[22].semigrupos, t[22].P, t[23].semigrupos, t[23].P], [170963, 26183, 282828, 13911])
  assert.equal(((100 * t[22].P) / t[22].semigrupos).toFixed(2), '15.32')
})

test('arvore, forca bruta e os dois jogos concordam ate o genero 12', { timeout: 600000 }, () => {
  for (const l of conferencia(12)) {
    assert.equal(l.mesmos, true)
    assert.equal(l.jogoDiverge, 0)
  }
})

test('ate 24, todo genero par tem fracao menor que os dois impares vizinhos', { timeout: 600000 }, () => {
  const t = porGenero(24)
  const pct = (g) => t[g - 1].P / t[g - 1].semigrupos
  for (let g = 2; g <= 24; g += 2) {
    assert.ok(pct(g) < pct(g - 1), 'genero ' + g)
    if (g < 24) assert.ok(pct(g) < pct(g + 1), 'genero ' + g)
  }
  // os pares de 8 a 24: o maior e 7,77% (12); os impares de 9 a 23: de 15,32% a 28,81%
  let maxPar = 0
  for (let g = 8; g <= 24; g += 2) maxPar = Math.max(maxPar, pct(g))
  assert.equal((100 * maxPar).toFixed(2), '7.77')
  assert.equal((100 * pct(9)).toFixed(2), '28.81')
})
