// Moedas de Sylver (Sylver coinage), de Conway.
//
// Dois jogadores falam numeros inteiros positivos, um de cada vez. Nao vale
// falar um numero que ja da para pagar com as moedas faladas (soma de
// multiplos delas). Quem fala o 1 perde, porque depois dele nada mais vale.
//
// Uma posicao e so o semigrupo gerado pelas moedas faladas. Quando o maximo
// divisor comum delas e 1, sobra uma quantidade finita de numeros que nao da
// para pagar (as lacunas), e o jogo e finito. A posicao aqui e a lista de
// lacunas, em ordem; o 1 e sempre lacuna ate alguem perder.

// lacunas do semigrupo gerado por `moedas` (mdc 1), por programacao dinamica
export function lacunasDe(moedas) {
  let mdc = 0
  const gcd = (a, b) => (b ? gcd(b, a % b) : a)
  for (const m of moedas) mdc = gcd(mdc, m)
  if (mdc !== 1) throw new Error('mdc diferente de 1: o jogo nao termina')
  const menor = Math.min(...moedas)
  // Frobenius < menor * maior; corta quando aparecem `menor` seguidos pagaveis
  const paga = [true]
  const lac = []
  let seguidos = 1
  for (let x = 1; seguidos < menor; x++) {
    let ok = false
    for (const m of moedas) if (x >= m && paga[x - m]) { ok = true; break }
    paga.push(ok)
    if (ok) seguidos++
    else { seguidos = 0; lac.push(x) }
  }
  return lac
}

// as lacunas depois de falar g (g e uma das lacunas)
export function fala(lacunas, g) {
  const F = lacunas[lacunas.length - 1]
  const eLacuna = new Uint8Array(F + 1)
  for (const x of lacunas) eLacuna[x] = 1
  const paga = new Uint8Array(F + 1)
  for (let x = 0; x <= F; x++) {
    if (!eLacuna[x]) paga[x] = 1
    else if (x >= g && paga[x - g]) paga[x] = 1
  }
  const r = []
  for (const x of lacunas) if (!paga[x]) r.push(x)
  return r
}

export function criaJogo() {
  const memo = new Map()
  // true se quem fala agora ganha
  function ganha(lacunas) {
    if (lacunas.length === 1) return false // so sobrou o 1
    const k = lacunas.join(',')
    const v = memo.get(k)
    if (v !== undefined) return v
    let r = false
    for (let i = lacunas.length - 1; i >= 1 && !r; i--) {
      if (!ganha(fala(lacunas, lacunas[i]))) r = true
    }
    memo.set(k, r)
    return r
  }
  // os lances que ganham (as lacunas g que deixam o outro perdido)
  function lancesQueGanham(lacunas) {
    const r = []
    for (let i = 1; i < lacunas.length; i++) if (!ganha(fala(lacunas, lacunas[i]))) r.push(lacunas[i])
    return r
  }
  return { ganha, lancesQueGanham, memo }
}
