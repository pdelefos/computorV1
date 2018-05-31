'use strict'

let expression = process.argv[2]
if (!expression) console.log('rien')

let terms = expression.trim().split('=')
let leftTerm = terms[0]
let rightTerm = terms[1]
leftTerm = parseTerm(leftTerm)
rightTerm = parseTerm(rightTerm)
console.log(leftTerm)

function equationSimplification (leftTerm, rightTerm) {
  let simplifiedEq = leftTerm.reduce((acc, m) => {}, new Array())
  return simplifiedEq
}

// 5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0
function parseTerm (term) {
  let monomes = term.split('+').reduce((acc, x) => {
    let splited = x.split('-').map(x => x.trim())
    splited = x.trim() == splited[0] ? splited[0] : `-${splited[0]}`
    acc.push(...splited)
    return acc
  }, new Array())
  console.log(monomes)
  let termData = monomes.reduce((acc, m) => {
    acc.push(parseMonome(m))
    return acc
  }, new Array())
  termData = sortTermByPower(termData)
  return termData
}

function parseMonome (monome) {
  let x = monome.split('*').map(x => x.trim())
  const data = {
    value: x[0],
    xPower: getXPower(x[1])
  }
  return data
}

function getXPower (exp) {
  return exp.split('^')[1].trim()
}

function sortTermByPower (term) {
  const byPowerDesc = (a, b) => a.xPower < b.xPower
  return term.sort(byPowerDesc)
}
