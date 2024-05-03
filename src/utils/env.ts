const POSSIBLE_ENVIRONMENT_VARIABLE_SETS = [
  ["AZURE_EMAIL_CONNECTION_STRING"],
  ["EMAIL_SENDER_ADDRESS"],
  ["INTERNAL_NOTIFICATION_EMAIL"],
] as const

for (const variableSet of POSSIBLE_ENVIRONMENT_VARIABLE_SETS) {
  const isOK = variableSet.some(
    (v) => v === null || process.env[v] !== undefined
  )
  if (!isOK) {
    throw new Error(`Any of the required env vars ${variableSet} are not set.`)
  }
}

export const getEnv = (
  variable: NonNullable<
    (typeof POSSIBLE_ENVIRONMENT_VARIABLE_SETS)[number][number]
  >
) => {
  const value = process.env[variable]

  if (!value) {
    throw new Error()
  }

  return value
}
