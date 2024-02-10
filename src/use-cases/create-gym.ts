import { Gym } from '@prisma/client'
import { GymsRespository } from '@/repositories/gyms-repository'

// criando uma interface para ser usada na função
interface GymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

// interface de resposta
interface GymUseCaseResponse {
  gym: Gym
}

// Inversão de dependência, dentro dessa classe eu posso passar o parâmetro
// de um repositório que eu quero usar
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRespository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: GymUseCaseRequest): Promise<GymUseCaseResponse> {
    // método de criação da interface gym repository do constructor
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
