# What The Dep!?

### Example

```bash
$ ./src/cli.js --source yoshi --prior-date 2018-06-01 --latter-date 2018-06-10

=== Comparing Dependencies ===
 * source: yoshi
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

### High level flow

use input time to query npm registry for release and generate the exact dependencies. For the example:

```
$ ./src/cli.js yoshi 2018-06-01 2018-06-10
```

* Get release times of `yoshi`
* For each given time:
    * Get the dependencies (prod + dev) at that time
    * resolve the dependency version
    * perform comparison


### TODOs
* publish as npm package
* move to incubator / wix organization
* write additional data apis (from local git repos? something else?)
* allow dump of partial json? only major/minor/patch changes, etc.
* integration with build systems
* local cache of npm registry
* visualization?
* recursion for N level dependencies