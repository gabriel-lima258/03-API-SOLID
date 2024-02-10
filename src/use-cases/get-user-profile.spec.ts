import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

// tipando as variáveis
let userRepository: InMemoryUserRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Authenticate Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(() => {
    // passando o repositório temporário criado
    userRepository = new InMemoryUserRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(userRepository)
  })

  it('should be able to get user profile', async () => {
    // criando um usuário temporário
    const createdUser = await userRepository.create({
      name: 'gabriel',
      email: 'gabriel@gmail.com',
      password_hash: await hash('123456', 6),
    })
    // tentando autenticar user
    const { user } = await getUserProfileUseCase.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('gabriel')
  })

  it('should not be able to get user profile', async () => {
    // autenticando com email errado
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
