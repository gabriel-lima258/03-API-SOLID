import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

// tipando as variáveis
let userRepository: InMemoryUserRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(() => {
    // passando o repositório temporário criado
    userRepository = new InMemoryUserRepository()
    authenticateUseCase = new AuthenticateUseCase(userRepository)
  })

  it('should be able to authenticate', async () => {
    // criando um usuário temporário
    await userRepository.create({
      name: 'gabriel',
      email: 'gabriel@gmail.com',
      password_hash: await hash('123456', 6),
    })

    // tentando autenticar user
    const { user } = await authenticateUseCase.execute({
      email: 'gabriel@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // autenticando com email errado
    await expect(() =>
      authenticateUseCase.execute({
        email: 'gabriel@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'gabriel',
      email: 'gabriel@gmail.com',
      password_hash: await hash('123456', 6),
    })

    // passando uma senha errada
    await expect(() =>
      authenticateUseCase.execute({
        email: 'gabriel@gmail.com',
        password: '623456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
