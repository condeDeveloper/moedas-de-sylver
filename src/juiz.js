// O juiz: o jogo jogado pelas moedas faladas, nao pelas lacunas, e os
// semigrupos achados por forca bruta. Nada do sylver.js nem do semigrupos.js.

// todos os numeros que NAO da para pagar com as moedas, ate o limite
function naoPagaveis(moedas, limite) {
  const paga = new Uint8Array(limite + 1)
  paga[0] = 1
  for (let x = 1; x <= limite; x++) for (const m of moedas) if (m <= x && paga[x - m]) { paga[x] = 1; break }
  const r = []
  for (let x = 1; x <= limite; x++) if (!paga[x]) r.push(x)
  return r
}

// o maior nao pagavel e menor que (menor moeda) * (maior moeda)
function lacunas(moedas) {
  const a = Math.min(...moedas), b = Math.max(...moedas)
  return naoPagaveis(moedas, a * b)
}

// true se quem fala agora ganha, com as moedas ja faladas
export function juizGanha(moedasIniciais) {
  const memo = new Map()
  function ganha(moedas) {
    const lac = lacunas(moedas)
    if (lac.length === 1) return false // so o 1: quem fala perde
    const k = lac.join(' ')
    if (memo.has(k)) return memo.get(k)
    let r = false
    for (const g of lac) {
      if (g === 1) continue
      if (!ganha([...moedas, g])) { r = true; break }
    }
    memo.set(k, r)
    return r
  }
  return ganha(moedasIniciais)
}

// Semigrupos de genero g por forca bruta: todo conjunto de g lacunas dentro
// de 1..2g-1 cujo complemento e fechado pela soma.
export function semigruposForcaBruta(g) {
  if (g === 0) return [[]]
  const N = 2 * g - 1
  const r = []
  const escolha = []
  function vai(inicio) {
    if (escolha.length === g) {
      const lac = new Set(escolha)
      for (let a = 1; a <= N; a++) {
        if (lac.has(a)) continue
        for (let b = a; a + b <= N; b++) if (!lac.has(b) && lac.has(a + b)) return
      }
      r.push(escolha.slice())
      return
    }
    for (let x = inicio; x <= N; x++) { escolha.push(x); vai(x + 1); escolha.pop() }
  }
  vai(1)
  return r
}
