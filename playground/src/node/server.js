const port = process.env.PORT ?? 3000

export function start() {
  return `listening on port ${port}`
}
