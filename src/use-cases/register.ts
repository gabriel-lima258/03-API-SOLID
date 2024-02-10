import { UsersRespository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

// criando uma interface para ser usada na função
interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// interface de resposta
interface RegisterUseCaseResponse {
  user: User
}

// Inversão de dependência, dentro dessa classe eu posso passar o parâmetro
// de um repositório que eu quero usar
export class RegisterUseCase {
  constructor(private usersRepository: UsersRespository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // criando um hash para senha, onde o 6 é quantas vezes será gerado o hash
    const password_hash = await hash(password, 6)

    // passando o método criado dentro da interface repository
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      // tratativa de erro
      throw new UserAlreadyExistsError()
    }

    // método de criação da interface user repository do constructor
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
