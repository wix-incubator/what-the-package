# What The Dep!?

### Example

```bash
$ ./src/cli.js yoshi 2018-06-01 2018-06-10

=== Comparing Dependencies ===
 * name: yoshi
 * prior: Thu, 31 May 2018 21:00:00 GMT
 * latter: Sat, 09 Jun 2018 21:00:00 GMT

=== Summary ===

Total packages: 119

Packages added: 2
Packages removed: 0
Packages remaining: 117

Packages changed: 9
Packages unchanged: 108

Major changed: 0
Minor changed: 4
Patch changed: 5
Other???: 0

Use the '--raw' flag to get a raw json
```


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


### Remaining features
* for unpublished packages: get package.json for dependency list
* performance improvements: parallelisation
* run mode --diff for showing only what changed
* --major, --minor, --patch added with --diff to show only major, minor, patch
* pretty output
* render "No changes found" when there are no changes
* when build fails in npm-ci-scripts, if user opted in with --dep-diff fetch last successful build timestamp from CI
