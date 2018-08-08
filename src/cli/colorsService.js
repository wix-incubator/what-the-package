const colors = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  RESET: "\x1b[0m"
}

const getColorConfigurator = isColorDisabled => color => {
  return !isColorDisabled ? color : ""
}

module.exports = {
  getColorConfigurator,
  colors
}
