import { UsersRespository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// interface de dados de requisição
interface GetUserProfileUseCaseRequest {
  userId: string // buscando um usuário pelo id
}

// interface de dados de resposta
interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  // criando a dependência de user repository
  constructor(private usersRepository: UsersRespository) {}

  // passando parâmetro de request e uma promise de response
  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    // caso passe retorne o usuário
    return {
      user,
    }
  }
}
