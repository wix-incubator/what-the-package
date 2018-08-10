# What The Package!? WTP!?

> Check which dependencies were updated between specific dates

This tool helps understand which npm dependencies were changed from last successful build or after you did `npm install`.
Respect semver described dependencies and check real latest published versions in NPM.
Nice tool for integration with CI builds. Works with published NPM package or git directory which have `package.json` file.

```
  $ npm i -g what-the-package

  $ wtp -s react -p 2018-05-01 -l 2018-08-09
  
  ✔ Resolving dependency is completed:
    * source: react
    * prior: 00:00 01-05-2018 (Tue) +03:00
    * latter: 00:00 09-08-2018 (Thu) +03:00
  
  ✔ Comparing dependencies is completed:
    Changed:
      loose-envify  1.3.1     →    1.4.0     minor
      fbjs          0.8.16    →    0.8.17    patch
      prop-types    15.6.1    →    15.6.2    patch
    
    Use the '--raw' flag to get a raw json
```

or you can use [npx](https://github.com/zkat/npx#one-off-invocation-without-local-installation) for one time usage:

```
  npx what-the-package -s react -p 2018-05-01 -l 2018-08-09
```

### Features

* Show differences in your dependencies between specific times.
* Show raw JSON output. Nice for integration with other tools.
* Works with npm packages or local git repositories.

### Other examples

```
  $ wtp -p 2018-01-01                                       # Check for current directory
  $ wtp -s ../your-local-repository -p '2018-01-01 09:30'   # Check for relative local directory
  $ wtp -s react --prior-date 2018-01-01T09:30              # Check for some npm package
  $ wtp -p 2018-01-01 -l 2018-04-01                         # Get comparison beetween specific dates

  $ wtp -s react -p 2018-05-01 -l 2018-08-09 --raw  # Get a raw output is JSON format
  [ { packageName: 'fbjs',
      priorVersion: '0.8.16',
      latterVersion: '0.8.17' },
    { packageName: 'loose-envify',
      priorVersion: '1.3.1',
      latterVersion: '1.4.0' },
    { packageName: 'object-assign',
      priorVersion: '4.1.1',
      latterVersion: '4.1.1' },
    { packageName: 'prop-types',
      priorVersion: '15.6.1',
      latterVersion: '15.6.2' } ]
```

### Options

| Option                   | Default                  | Description                                                                         |
| -------------------------| ------------------------ | ----------------------------------------------------------------------------------- |
| `-p, --prior-date`       |                          | Date of comparison start, usually when build was green. **Required**.               |
| `-l, --latter-date`      | Current time             | Date of comparison end, usually time when the build is broken.                      |
| `-s, --source`           | Current git directory    | Specify source project — local path to git repository or npm package name.          |
| `-n, --no-color`         | false                    | Disable color output                                                                |
| `--raw`                  |                          | Return a raw JSON of comparison.                                                    |

`--prior-date, --latter-date`
Accepts date in a format which `dayjs` lib [accepts](https://github.com/iamkun/dayjs/blob/master/docs/en/API-reference.md#constructor-dayjsexisting-string--number--date--dayjs). Usually is [ISO-8601](https://en.wikipedia.org/wiki/ISO_8601).

### TODOs
  * Allow dump of partial json? only major/minor/patch changes, etc.
  * Integration with build systems
  * Local cache of npm registry
  * Recursion for N level dependencies


