import { Gym } from '@prisma/client'
import { GymsRespository } from '@/repositories/gyms-repository'

// criando uma interface para ser usada na função
interface SearchGymsUseCaseRequest {
  query: string
  page: number
}

// interface de resposta
interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

// Inversão de dependência, dentro dessa classe eu posso passar o parâmetro
// de um repositório que eu quero usar
export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRespository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    // método de criação da interface gym search title repository do constructor
    const gyms = await this.gymsRepository.searchMany(query, page)

    return {
      gyms,
    }
  }
}
