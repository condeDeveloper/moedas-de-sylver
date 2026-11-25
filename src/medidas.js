// Uma funcao por tabela do README. Cada uma calculada uma vez so.

import { criaJogo, lacunasDe } from './sylver.js'
import { semigruposAte } from './semigrupos.js'
import { juizGanha, semigruposForcaBruta } from './juiz.js'

const cache = new Map()
const guarda = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k) }
const jogo = criaJogo()
const gcd = (a, b) => (b ? gcd(b, a % b) : a)

export function geradoresMinimos(lacunas) {
  const F = lacunas.length ? lacunas[lacunas.length - 1] : -1
  const lac = new Set(lacunas)
  const pertence = (x) => x >= 0 && !lac.has(x)
  let m = 1
  while (!pertence(m)) m++
  const r = []
  for (let x = 1; x <= F + m; x++) {
    if (!pertence(x)) continue
    let soma = false
    for (let a = 1; a <= x / 2 && !soma; a++) if (pertence(a) && pertence(x - a)) soma = true
    if (!soma) r.push(x)
  }
  return r
}

// por genero: quantos semigrupos, quantos perdem para quem fala
export const porGenero = (G) => guarda('genero' + G, () => {
  const S = semigruposAte(G)
  const r = []
  for (let g = 1; g <= G; g++) {
    let P = 0
    const exemplos = []
    for (const l of S[g]) if (!jogo.ganha(l)) { P++; if (exemplos.length < 3) exemplos.push(l) }
    r.push({ g, semigrupos: S[g].length, P, exemplos })
  }
  return r
})

// os pares {a, b} com mdc 1 e b <= N
export const pares = (N) => guarda('pares' + N, () => {
  const P = []
  let total = 0
  const lances = {}
  for (let b = 3; b <= N; b++) {
    for (let a = 2; a < b; a++) {
      if (gcd(a, b) !== 1) continue
      total++
      const l = lacunasDe([a, b])
      if (!jogo.ganha(l)) P.push([a, b])
      else lances[`${a},${b}`] = jogo.lancesQueGanham(l)
    }
  }
  return { total, P, lances }
})

// o semigrupo ordinario: lacunas 1..g
export const ordinario = (G) => guarda('ord' + G, () => {
  const r = []
  for (let g = 1; g <= G; g++) {
    const l = []
    for (let i = 1; i <= g; i++) l.push(i)
    r.push(jogo.ganha(l) ? 'N' : 'P')
  }
  return r.join('')
})

// a arvore contra a forca bruta, e o jogo pelas lacunas contra o jogo pelas
// moedas, em todos os semigrupos ate o genero K
export const conferencia = (K) => guarda('conf' + K, () => {
  const S = semigruposAte(K)
  const r = []
  for (let g = 1; g <= K; g++) {
    const bruta = semigruposForcaBruta(g).map((x) => x.join(' '))
    const arvore = new Set(S[g].map((x) => x.join(' ')))
    const mesmos = bruta.length === arvore.size && bruta.every((x) => arvore.has(x))
    let jogoDiverge = 0
    for (const l of S[g]) if (juizGanha(geradoresMinimos(l)) !== jogo.ganha(l)) jogoDiverge++
    r.push({ g, bruta: bruta.length, arvore: arvore.size, mesmos, jogoDiverge })
  }
  return r
})

// quantos lances ganham em cada par, e em quantos o lance que ganha e o
// proprio numero de Frobenius do par (ab - a - b, o maior que nao se paga)
export function respostas(N) {
  const { lances } = pares(N)
  const porQuantidade = {}
  const frobenius = []
  let maior = null
  for (const [k, v] of Object.entries(lances)) {
    porQuantidade[v.length] = (porQuantidade[v.length] || 0) + 1
    const [a, b] = k.split(',').map(Number)
    if (v.includes(a * b - a - b)) frobenius.push(k)
    const m = Math.max(...v)
    if (!maior || m > maior.lance) maior = { par: k, lance: m }
  }
  return { porQuantidade, frobenius, maior }
}

export const memoDoJogo = () => jogo.memo.size
