'use strict'

let expression = process.argv[2]
if (!expression) console.log('rien')

let terms = expression.split('=')
let leftTerm = terms[0]
let rightTerm = terms[1]
console.log(terms[0])
