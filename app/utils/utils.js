const debugFlag = true

export const debug = (message, level = 'log') => {
  if (!debugFlag) return

  console[level](message)
}
