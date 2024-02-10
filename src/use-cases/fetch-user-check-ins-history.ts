import { CheckInRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'

// interface de dados de requisição
interface FetchUserCheckInHistoryUseCaseRequest {
  userId: string
  page: number
}

// interface de dados de resposta
interface FetchUserCheckInHistoryUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInHistoryUseCase {
  // criando a dependência de checkIn repository
  constructor(private checkInRepository: CheckInRepository) {}

  // passando parâmetro de request e uma promise de response
  async execute({
    userId,
    page,
  }: FetchUserCheckInHistoryUseCaseRequest): Promise<FetchUserCheckInHistoryUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
}
