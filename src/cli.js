#!/usr/bin/env node

const { compareNpmModuleDependencies } = require("./utils")

const [, , ...args] = process.argv
const [npmModuleName, priorDate, latterDate] = args

console.log(
  JSON.stringify(
    compareNpmModuleDependencies(
      npmModuleName,
      new Date(priorDate).valueOf(),
      new Date(latterDate).valueOf()
    ),
    null,
    2
  )
)
