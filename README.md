# What The Dep!?

### known issues

* we ignore release tags, only semver

### High level flow

Given a `package.json` and a `targetDate`:

1. get dependencies from `package.json`
1. for each dep, get output of `npm view`
1. for each output of `npm view`, return the latest release which conforms to:
  * `package.json`'s version rule
  * release date is before `targetDate`
  * error if result is empty


###  Prettier example

* running `npm view prettier` gave an output saved in `data/`
* Assuming a package json with `prettier` version `^1.13.6` or laxer, you can see that when running `npm i`:
  * on the date of `2018-06-26` will install version 1.13.6
  * on the date of `2018-06-29` will install version 1.13.7






