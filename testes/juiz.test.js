import { test } from 'node:test'
import assert from 'node:assert/strict'
import { juizGanha, semigruposForcaBruta } from '../src/juiz.js'
import { conferencia } from '../src/medidas.js'
import { criaJogo, lacunasDe } from '../src/sylver.js'

test('o juiz pelas moedas: {2, 3} perde, {3, 4} ganha', () => {
  assert.equal(juizGanha([2, 3]), false)
  assert.equal(juizGanha([3, 4]), true)
})

test('a forca bruta acha 2 semigrupos de genero 2: lacunas {1, 2} e {1, 3}', () => {
  assert.deepEqual(semigruposForcaBruta(2), [[1, 2], [1, 3]])
})

test('arvore e forca bruta dao os mesmos semigrupos, e os dois jogos concordam, ate o genero 10', () => {
  for (const l of conferencia(10)) {
    assert.equal(l.mesmos, true, 'genero ' + l.g)
    assert.equal(l.jogoDiverge, 0, 'genero ' + l.g)
  }
})

test('os dois jogos concordam nos pares ate 11', () => {
  const J = criaJogo()
  const gcd = (a, b) => (b ? gcd(b, a % b) : a)
  for (let b = 3; b <= 11; b++) for (let a = 2; a < b; a++) {
    if (gcd(a, b) !== 1) continue
    assert.equal(juizGanha([a, b]), J.ganha(lacunasDe([a, b])), `{${a}, ${b}}`)
  }
})
