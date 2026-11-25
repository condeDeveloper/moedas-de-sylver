import { test } from 'node:test'
import assert from 'node:assert/strict'
import { lacunasDe, fala, criaJogo } from '../src/sylver.js'
import { semigruposAte } from '../src/semigrupos.js'
import { geradoresMinimos } from '../src/medidas.js'

test('as lacunas de alguns semigrupos feitos a mao', () => {
  assert.deepEqual(lacunasDe([2, 3]), [1])
  assert.deepEqual(lacunasDe([3, 5]), [1, 2, 4, 7])
  assert.deepEqual(lacunasDe([3, 4]), [1, 2, 5])
})

test('mdc diferente de 1 nao e posicao de jogo finito', () => {
  assert.throws(() => lacunasDe([4, 6]))
})

test('falar uma lacuna tira ela e tudo que ela ajuda a pagar', () => {
  // em <3, 5> falar 4: 4, 7 (= 3 + 4) e 8 viram pagaveis; sobram 1 e 2
  assert.deepEqual(fala([1, 2, 4, 7], 4), [1, 2])
  assert.deepEqual(fala([1, 2, 4, 7], 2), [1])
})

test('{2, 3} perde para quem fala: so sobrou o 1', () => {
  const J = criaJogo()
  assert.equal(J.ganha([1]), false)
  assert.equal(J.ganha(lacunasDe([3, 4])), true)
  assert.deepEqual(J.lancesQueGanham(lacunasDe([3, 4])), [2])
})

test('a arvore tem um semigrupo de genero 0 (N) e cada filho tem uma lacuna a mais', () => {
  const S = semigruposAte(8)
  assert.deepEqual(S[0], [[]])
  for (let g = 1; g <= 8; g++) for (const l of S[g]) assert.equal(l.length, g)
})

test('os geradores minimos de <4, 9, 14, 15>', () => {
  assert.deepEqual(geradoresMinimos(lacunasDe([4, 9, 14, 15])), [4, 9, 14, 15])
  assert.deepEqual(geradoresMinimos([1, 2, 3, 4]), [5, 6, 7, 8, 9])
})
