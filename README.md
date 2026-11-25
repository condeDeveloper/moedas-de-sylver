# Moedas de Sylver

O jogo de Conway em que dois jogadores falam números e não vale falar o que já dá para pagar com as moedas faladas. Quem fala o 1 perde. Em Node puro, sem dependência nenhuma.

Uma posição do jogo é só o **semigrupo numérico** das moedas faladas: o conjunto de valores que dá para pagar. Os que não dá para pagar são as **lacunas**, e são eles que ainda se pode falar. Então em vez de jogar partidas, aqui se varrem **todos os semigrupos numéricos** até 24 lacunas (há 282.828 só com 24) e se decide, para cada um, se quem fala agora ganha ou perde.

---

## Os quatro achados

**1. Com 2, 4 ou 6 números ainda faláveis, ninguém perde; com 8, só uma posição perde.** Em todas as 32 posições com 2, 4 ou 6 lacunas, quem fala tem um lance que ganha. Com 8 lacunas são 67 posições, e uma só perde para quem fala: a das moedas **4, 9, 14 e 15**.

**2. O número de lacunas ímpar é muito mais perigoso que o par.** De 9 a 23 lacunas, a fração de posições em que quem fala perde fica entre **15,32% e 28,81%** nos números ímpares. De 8 a 24, nos pares, nunca passa de **7,77%**. A alternância não falha uma vez na tabela.

**3. Entre os pares de moedas, só {2, 3} perde para quem fala.** São os 57 pares `{a, b}` com `mdc = 1` e `b` até 15. Em todos os outros quem fala tem um lance que ganha, e quase sempre **um só**: 47 dos 56.

**4. Em {13, 14} o único lance que ganha é o 155.** Das 78 lacunas, só falar o 155 ganha, e 155 é o **número de Frobenius** do par (`13·14 − 13 − 14`), o maior valor que não dá para pagar com 13 e 14. O mesmo acontece em seis pares: {2, 5}, {4, 5}, {5, 6}, {5, 9}, {8, 15} e {13, 14}. Nos outros, o lance que ganha fica no meio.

**E uma regra que parece certa e quebra:** a posição em que as lacunas são exatamente `1, 2, ..., g` (o semigrupo "ordinário") perde para quem fala em todo `g` ímpar de 1 a 11. No 13 ela ganha. Volta a perder no 15 e no 17, ganha no 19 e no 21, e perde no 23.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

### Todas as posições, pelo número de lacunas

| lacunas | posições | quem fala perde | % |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 100,00 |
| 2 | 2 | **0** | 0,00 |
| 3 | 4 | 1 | 25,00 |
| 4 | 7 | **0** | 0,00 |
| 5 | 12 | 6 | 50,00 |
| 6 | 23 | **0** | 0,00 |
| 7 | 39 | 15 | 38,46 |
| 8 | 67 | **1** | 1,49 |
| 9 | 118 | 34 | 28,81 |
| 10 | 204 | 11 | 5,39 |
| 11 | 343 | 94 | 27,41 |
| 12 | 592 | 46 | 7,77 |
| 13 | 1.001 | 262 | 26,17 |
| 14 | 1.693 | 81 | 4,78 |
| 15 | 2.857 | 615 | 21,53 |
| 16 | 4.806 | 239 | 4,97 |
| 17 | 8.045 | 1.620 | 20,14 |
| 18 | 13.467 | 711 | 5,28 |
| 19 | 22.464 | 3.884 | 17,29 |
| 20 | 37.396 | 2.012 | 5,38 |
| 21 | 62.194 | 10.011 | 16,10 |
| 22 | 103.246 | 5.452 | 5,28 |
| 23 | 170.963 | 26.183 | 15,32 |
| 24 | 282.828 | 13.911 | 4,92 |

Com 1 lacuna só sobra o 1: quem fala perde.

### Os pares de moedas até 15

57 pares com `mdc = 1`. Perde para quem fala: só {2, 3}. Lances que ganham por par: 1 lance em 47, 2 em 8, 3 em 1 ({10, 11}: 24, 28 ou 47). O maior lance vencedor é o 155, em {13, 14}.

### O semigrupo ordinário, de 1 a 24 lacunas

`P N P N P N P N P N P N N N P N P N N N N N P N` (P = quem fala perde)

---

## Os juízes

**A árvore contra a força bruta.** `src/semigrupos.js` gera os semigrupos pela árvore de Rosales (o filho de `S` é `S` sem um gerador mínimo maior que o Frobenius), que dá cada um exatamente uma vez. `src/juiz.js` acha os mesmos por força bruta: todo conjunto de `g` lacunas dentro de `1..2g−1` cujo complemento é fechado pela soma. Até 12 lacunas os dois dão os **mesmos conjuntos**, não só a mesma contagem.

**O jogo de dois jeitos.** O núcleo joga pelas lacunas e calcula o que sobra depois de cada lance. O juiz joga pelas **moedas faladas**: guarda a lista de moedas e recalcula do zero o que não dá para pagar. Em todos os semigrupos até 12 lacunas, e em todos os pares até 11, os dois dizem a mesma coisa.

---

## O que as medidas me corrigiram

- **A árvore não saía da raiz.** O gerador mínimo de um semigrupo é no máximo `Frobenius + multiplicidade`, e eu usei esse teto. No próprio ℕ o Frobenius é −1 e a multiplicidade é 1, então o teto dá 0 e o gerador 1 ficava de fora: a árvore inteira saía vazia e a tabela, zerada. O teto agora é `Frobenius + multiplicidade + 1`; nos outros semigrupos esse número a mais é uma soma, e a checagem de mínimo o descarta.
- **Escrevi um limite olhando só parte da tabela.** O teste dizia que os gêneros pares ficavam abaixo de 5,4%, porque eu tinha olhado o 10, o 14 e o 20. O gênero 12 dá 7,77%, e o teste quebrou. O limite agora sai do programa: o maior par e o menor ímpar, com o gênero em que acontecem.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test
node ferramentas/medidor.js genero 24       # ~20 s
node ferramentas/medidor.js pares 15        # ~40 s
node exemplos/uso.js
```

```js
import { criaJogo, lacunasDe } from 'moedas-de-sylver'

const jogo = criaJogo()
jogo.lancesQueGanham(lacunasDe([13, 14]))   // [155]
jogo.ganha(lacunasDe([2, 3]))               // false
```

## Os arquivos

- `src/sylver.js`: as lacunas, o lance e a busca com memória.
- `src/semigrupos.js`: todos os semigrupos numéricos até um gênero, pela árvore.
- `src/juiz.js`: o jogo pelas moedas faladas e os semigrupos por força bruta.
- `src/medidas.js`: as tabelas do README.
- `ferramentas/medidor.js`: imprime as tabelas.
- `testes/`: 19 testes; os gêneros 23 e 24 ficam em `pesados.test.js`.

## Licença

MIT.
