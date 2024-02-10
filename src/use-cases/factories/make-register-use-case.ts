import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-respository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  // instâncio a dependência de repository prisma
  const prismaUsersRepository = new PrismaUsersRepository()
  // e dentro do construtor da classe eu passo a dependência do repository
  const registerUseCase = new RegisterUseCase(prismaUsersRepository)

  return registerUseCase
}
