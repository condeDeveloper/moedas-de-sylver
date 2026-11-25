// Todos os semigrupos numericos ate um genero (numero de lacunas), pela
// arvore de Rosales: o filho de S e S sem um gerador minimo maior que o numero
// de Frobenius de S. Cada semigrupo aparece uma vez so.
//
// Toda posicao de Moedas de Sylver com mdc 1 e um semigrupo numerico (o das
// moedas ja faladas), e todo semigrupo numerico e uma posicao (falando os
// geradores minimos dele). Entao classificar todos os semigrupos de genero g
// e classificar todas as posicoes com g numeros ainda falaveis.

// geradores minimos maiores que o Frobenius
function geradoresAcimaDoFrobenius(lacunas) {
  const F = lacunas.length ? lacunas[lacunas.length - 1] : -1
  const eLacuna = new Set(lacunas)
  const pertence = (x) => x >= 0 && !eLacuna.has(x)
  // multiplicidade: menor elemento positivo
  let m = 1
  while (!pertence(m)) m++
  const r = []
  // ate F + m + 1: no proprio N (F = -1) o gerador 1 fica fora de F + m; nos
  // outros, F + m + 1 = (F + 1) + m e soma e cai na checagem de minimo
  for (let x = F + 1; x <= F + m + 1; x++) {
    if (x <= 0) continue
    let soma = false
    for (let a = 1; a <= x / 2 && !soma; a++) if (pertence(a) && pertence(x - a)) soma = true
    if (!soma) r.push(x)
  }
  return r
}

// porGenero[g] = lista de semigrupos (cada um = lista ordenada de lacunas)
export function semigruposAte(G) {
  const porGenero = [[[]]]
  for (let g = 1; g <= G; g++) {
    const prox = []
    for (const lac of porGenero[g - 1]) {
      for (const x of geradoresAcimaDoFrobenius(lac)) prox.push([...lac, x])
    }
    porGenero.push(prox)
  }
  return porGenero
}
