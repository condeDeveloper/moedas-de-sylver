import { criaJogo, lacunasDe } from '../src/index.js'

const jogo = criaJogo()

// depois de 13 e 14, o que voce fala para ganhar?
const pos = lacunasDe([13, 14])
console.log(`${pos.length} numeros ainda falaveis`)
console.log('lances que ganham:', jogo.lancesQueGanham(pos))

// depois de 2 e 3, quem fala perde: so sobrou o 1
console.log('{2, 3} ganha para quem fala?', jogo.ganha(lacunasDe([2, 3])))
