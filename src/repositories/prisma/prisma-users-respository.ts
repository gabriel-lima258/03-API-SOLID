import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
// devemos implementar a interface de user criada
import { UsersRespository } from '../users-repository'

// Prisma permite acessar tabelas criadas por nós, isso permite a acessibilidade do código
// No exemplo, data tem todos as variáveis da tabela users

export class PrismaUsersRepository implements UsersRespository {
  // método findById de interface repository
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })

    return user
  }

  // método findByEmail da interface
  async findByEmail(email: string) {
    // findUnique serve para achar os msm valores da tabela com @id ou @unique
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return user
  }

  // método create da interface
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
