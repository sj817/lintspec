export interface User {
  id: number
  name: string
}

export function greet(user: User): string {
  return `hello ${user.name}`
}
