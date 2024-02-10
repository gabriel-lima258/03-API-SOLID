import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInRepository = new PrismaCheckInRepository()

  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInHistoryUseCase(
    prismaCheckInRepository,
  )

  return fetchUserCheckInsHistoryUseCase
}
