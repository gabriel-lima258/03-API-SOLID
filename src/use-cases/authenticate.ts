import { UsersRespository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

// interface de dados de requisição
interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

// interface de dados de resposta
interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  // criando a dependência de user repository
  constructor(private usersRepository: UsersRespository) {}

  // passando parâmetro de request e uma promise de response
  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    // verificação se email não é igual
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // comparando as senhas
    const doesPassowordMatches = await compare(password, user.password_hash)

    // verificação se a senha são iguais
    if (!doesPassowordMatches) {
      throw new InvalidCredentialsError()
    }

    // caso passe retorne o usuário
    return {
      user,
    }
  }
}
