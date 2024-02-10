import { CheckInRepository } from '@/repositories/check-ins-repository'

// interface de dados de requisição
interface GetUserMetricsUseCaseRequest {
  userId: string
}

// interface de dados de resposta
interface GetUserMetricsUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  // criando a dependência de checkIn repository
  constructor(private checkInRepository: CheckInRepository) {}

  // passando parâmetro de request e uma promise de response
  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
