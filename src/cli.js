#!/usr/bin/env node
/* eslint no-console: 0 */

const createDependencyComparator = require("../src/createDependencyComparator")
const dataApi = require("../src/data-api")
const { compareNpmModuleDependencies } = createDependencyComparator(dataApi)

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
