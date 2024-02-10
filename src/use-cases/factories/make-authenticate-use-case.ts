import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-respository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  // instâncio a dependência de repository prisma
  const prismaUsersRepository = new PrismaUsersRepository()
  // e dentro do construtor da classe eu passo a dependência do repository
  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

  return authenticateUseCase
}
