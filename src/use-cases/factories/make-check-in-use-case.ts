import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()
  const prismaGymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new CheckInUseCase(
    prismaCheckInRepository,
    prismaGymsRepository,
  )

  return checkInUseCase
}
