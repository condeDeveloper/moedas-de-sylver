// node ferramentas/medidor.js [genero G | pares N | ordinario G | conferencia K]
// Sem argumento: genero 22, pares 14, ordinario 22, conferencia 10.
import * as M from '../src/medidas.js'

const fmt = (n) => n.toLocaleString('pt-BR')
const [qual, arg] = process.argv.slice(2)
const quer = (t) => !qual || qual === t
const t0 = Date.now()

if (quer('genero')) {
  const G = +(arg || 22)
  console.log(`## todas as posicoes com g numeros ainda falaveis, ate ${G}`)
  console.log('g | semigrupos | perde quem fala | %')
  for (const l of M.porGenero(G)) console.log(`${l.g} | ${fmt(l.semigrupos)} | ${fmt(l.P)} | ${((100 * l.P) / l.semigrupos).toFixed(2)}`)
  const g8 = M.porGenero(G)[7]
  if (g8) console.log(`a unica de genero 8: lacunas ${g8.exemplos[0].join(' ')}, geradores ${M.geradoresMinimos(g8.exemplos[0]).join(', ')}`)
}
if (quer('pares')) {
  const N = +(arg || 14)
  const p = M.pares(N)
  const r = M.respostas(N)
  console.log(`## os pares {a, b} com mdc 1 e b ate ${N}`)
  console.log(`${p.total} pares; perdem para quem fala: ${p.P.map((x) => '{' + x.join(', ') + '}').join(' ')}`)
  console.log(`lances que ganham por par: ${JSON.stringify(r.porQuantidade)}`)
  console.log(`o lance que ganha e o Frobenius do par em: ${r.frobenius.map((x) => '{' + x + '}').join(' ')}`)
  console.log(`maior lance vencedor: ${r.maior.lance} em {${r.maior.par}}`)
  for (const [k, v] of Object.entries(p.lances)) console.log(`{${k}} -> ${v.join(', ')}`)
  console.log(`${fmt(M.memoDoJogo())} posicoes na memoria`)
}
if (quer('ordinario')) {
  const G = +(arg || 22)
  console.log(`## o semigrupo ordinario (lacunas 1..g), g de 1 a ${G}`)
  console.log(M.ordinario(G))
}
if (quer('conferencia')) {
  const K = +(arg || 10)
  console.log(`## a arvore contra a forca bruta, e o jogo pelas moedas, ate o genero ${K}`)
  console.log('g | forca bruta | arvore | mesmos conjuntos | jogo diverge')
  for (const l of M.conferencia(K)) console.log(`${l.g} | ${l.bruta} | ${l.arvore} | ${l.mesmos ? 'sim' : 'NAO'} | ${l.jogoDiverge}`)
}
console.log(`(${((Date.now() - t0) / 1000).toFixed(1)} s)`)
