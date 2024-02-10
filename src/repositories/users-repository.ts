import { Prisma, User } from '@prisma/client'

export interface UsersRespository {
  // busca um usuário pelo id
  findById(id: string): Promise<User | null>
  // pesquisa user pelo email caso não encontre null
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
