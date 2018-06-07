'use strict'

let expression = process.argv[2]
if (!expression) console.log('rien')

result(expression)

function result (expression) {
  let terms = expression.trim().split('=')
  let leftTerm = terms[0]
  let rightTerm = terms[1]
  leftTerm = parseTerm(leftTerm)
  console.log(leftTerm)
  rightTerm = parseTerm(rightTerm)
  rightTerm = evaluateRightTerm(rightTerm)
  let allTerms = [...leftTerm, ...rightTerm]
  let simplifiedTerms = simplifyTerms(allTerms)
  let eqDegreee = findPolynomialDegree(allTerms)
  console.log('Reduced form: ' + getEquationString(simplifiedTerms))
  console.log('Polynomial degree: ' + eqDegreee)
  if (eqDegreee == 0) {
    console.log('The solution include all real numbers.')
    return
  }
  if (eqDegreee > 2) {
    console.log(
      "The polynomial degree is stricly greater than 2, I can't solve."
    )
    return
  }
  calculateSolution(simplifiedTerms, eqDegreee)
}

function calculateSolution (simplifiedTerms, eqDegreee) {
  let a = findValudeByXPower(simplifiedTerms, 2)
  let b = findValudeByXPower(simplifiedTerms, 1)
  let c = findValudeByXPower(simplifiedTerms, 0)
  if (eqDegreee == 1) {
    let result = 'The solution is:'
    let x = -c / b
    console.log(result)
    console.log(x)
    return
  }
  let delta = calculateDelta(a, b, c)
  if (delta > 0) {
    let x1 = (-b - Math.sqrt(delta)) / (2 * a)
    let x2 = (-b + Math.sqrt(delta)) / (2 * a)
    let result = 'Discriminant is strictly positive, the two solutions are:'
    console.log(result)
    console.log(x1)
    console.log(x2)
  } else if (delta == 0) {
    let x = -b / (2 * a)
    let result = 'The solution is:'
    console.log(result)
    console.log(x)
  } else {
    let x1 = `x1 = ${-b} + ${Math.sqrt(Math.abs(delta))}i / ${2 * a}`
    let x2 = `x2 = ${-b} - ${Math.sqrt(Math.abs(delta))}i / ${2 * a}`
    // let result = `Discriminant is strictly negative, there's no solutions`
    // console.log(result)
    console.log(x1)
    console.log(x2)
  }
}

function calculateDelta (a, b, c) {
  return Math.pow(b, 2) - 4 * a * c
}

function findValudeByXPower (terms, xPower) {
  let monome = terms.find(m => m.xPower == xPower)
  let value = 0
  if (monome) value = monome.value
  return value
}

function findPolynomialDegree (terms) {
  return terms.reduce((acc, m) => {
    if (m.xPower > acc) acc = m.xPower
    return acc
  }, 0)
}

function getEquationString (equation) {
  let eq = ``
  let equationLenght = equation.length
  equation.forEach((m, idx) => {
    let value = m.value
    if (idx != 0 && m.value < 0) {
      eq += ` - `
      value *= -1
    } else if (idx != 0) eq += ` + `
    eq += `${value} * X^${m.xPower}`
    if (idx == equationLenght - 1) eq += ` = 0`
  })
  return eq
}

function parseTerm (term) {
  let monomes = term.split('+').reduce((acc, x) => {
    x = x.trim()
    let splited = x.split('-').map(x => x.trim())
    splited = trimArray(splited)
    if (x != splited) {
      let minusIndex = x.indexOf('-')
      let subString = x.substring(minusIndex, x.length).split(' ')
      if (subString[0] == '-') {
        subString[1] = '-' + subString[1]
        subString.splice(0, 1)
      }
      subString.join('')
      splited = splited.map(m => {
        let newMonome = subString.join(' ').trim()
        console.log(newMonome)
        console.log(m)
        console.log('sub', newMonome.substring(1, newMonome.length))
        if (newMonome.substring(1, newMonome.length) == m) return newMonome
        return m
      })
    }
    acc.push(...splited)
    return acc
  }, new Array())
  return createTermObject(monomes)
}

function simplifyTerms (terms) {
  let simplifiedEq = []
  terms.forEach(m => {
    let mSamePower = simplifiedEq.find(n => n.xPower == m.xPower)
    if (!mSamePower) simplifiedEq.push(m)
    else mSamePower.value += m.value
  })
  return simplifiedEq
}

function evaluateRightTerm (rightTerm) {
  return rightTerm.map(m => {
    m.value *= -1
    return m
  })
}

function createTermObject (monomes) {
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
    value: parseFloat(x[0]),
    xPower: getXPower(x[1])
  }
  return data
}

function getXPower (exp) {
  return parseInt(exp.split('^')[1].trim())
}

function sortTermByPower (term) {
  const byPowerDesc = (a, b) => a.xPower < b.xPower
  return term.sort(byPowerDesc)
}

function trimArray (array) {
  return array.filter(x => x != '')
}
