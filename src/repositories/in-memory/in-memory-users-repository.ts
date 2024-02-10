import { Prisma, User } from '@prisma/client'
import { UsersRespository } from './../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements UsersRespository {
  // criando um array de memória temporária
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    // buscando user com mesmo email
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    // criando um user
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    // inserindo no banco criado
    this.items.push(user)

    return user
  }
}
