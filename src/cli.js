#!/usr/bin/env node

const { compareNpmModuleDependencies } = require("./utils")

const [, , ...args] = process.argv
const [npmModuleName, priorDate, latterDate] = args

compareNpmModuleDependencies(
  npmModuleName,
  new Date(priorDate).valueOf(),
  new Date(latterDate).valueOf()
)
  .then(res => {
    console.log("great success!!!", { res })
    JSON.stringify(res, null, 2)
  })
  .catch(err => console.error("disgraceful error!", { err }))
