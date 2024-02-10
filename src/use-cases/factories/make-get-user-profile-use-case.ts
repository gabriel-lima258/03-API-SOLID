import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-respository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()

  const getUserProfileUseCase = new GetUserProfileUseCase(prismaUsersRepository)

  return getUserProfileUseCase
}
