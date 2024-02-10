import { Gym } from '@prisma/client'
import { GymsRespository } from '@/repositories/gyms-repository'

// criando uma interface para ser usada na função
interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

// interface de resposta
interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

// Inversão de dependência, dentro dessa classe eu posso passar o parâmetro
// de um repositório que eu quero usar
export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRespository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    // método de criação da interface gym search title repository do constructor
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
