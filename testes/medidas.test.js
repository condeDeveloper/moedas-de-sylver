// Os numeros do README presos. Se o codigo mudar e o numero mudar, quebra.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { porGenero, pares, respostas, ordinario, geradoresMinimos } from '../src/medidas.js'

test('semigrupos e posicoes perdedoras por genero, ate 22', () => {
  const t = porGenero(22)
  assert.deepEqual(t.map((l) => l.semigrupos), [1, 2, 4, 7, 12, 23, 39, 67, 118, 204, 343, 592, 1001, 1693, 2857, 4806, 8045, 13467, 22464, 37396, 62194, 103246])
  assert.deepEqual(t.map((l) => l.P), [1, 0, 1, 0, 6, 0, 15, 1, 34, 11, 94, 46, 262, 81, 615, 239, 1620, 711, 3884, 2012, 10011, 5452])
})

test('com 2, 4 ou 6 numeros falaveis ninguem perde; com 8, uma posicao so: <4, 9, 14, 15>', () => {
  const t = porGenero(8)
  assert.equal(t[1].P + t[3].P + t[5].P, 0)
  assert.equal(t[7].P, 1)
  assert.deepEqual(geradoresMinimos(t[7].exemplos[0]), [4, 9, 14, 15])
})

test('do genero 8 ao 22: o par chega no maximo a 7,77% (no 12), o impar nunca cai de 16,10% (no 21)', () => {
  let maxPar = 0, gPar = 0, minImpar = 100, gImpar = 0
  for (const l of porGenero(22)) {
    if (l.g < 8) continue
    const pct = (100 * l.P) / l.semigrupos
    if (l.g % 2 === 0 && pct > maxPar) { maxPar = pct; gPar = l.g }
    if (l.g % 2 === 1 && pct < minImpar) { minImpar = pct; gImpar = l.g }
  }
  assert.deepEqual([maxPar.toFixed(2), gPar, minImpar.toFixed(2), gImpar], ['7.77', 12, '16.10', 21])
})

test('pares ate 14: so {2, 3} perde, e 42 dos 49 que ganham tem um lance so', () => {
  const p = pares(14)
  assert.equal(p.total, 50)
  assert.deepEqual(p.P, [[2, 3]])
  const r = respostas(14)
  assert.deepEqual(r.porQuantidade, { 1: 42, 2: 6, 3: 1 })
})

test('em {13, 14} o unico lance que ganha e 155, o Frobenius do par', () => {
  const p = pares(14)
  assert.deepEqual(p.lances['13,14'], [155])
  assert.equal(13 * 14 - 13 - 14, 155)
  assert.deepEqual(respostas(14).frobenius, ['2,5', '4,5', '5,6', '5,9', '13,14'])
  assert.deepEqual(respostas(14).maior, { par: '13,14', lance: 155 })
})

test('o semigrupo ordinario perde nos impares ate 11, e no 13 vira', () => {
  assert.equal(ordinario(22), 'PNPNPNPNPNPNNNPNPNNNNN')
})
