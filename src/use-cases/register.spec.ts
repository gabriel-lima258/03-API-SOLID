import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

// tipando as variáveis
let userRepository: InMemoryUserRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(() => {
    // passando o repositório temporário criado
    userRepository = new InMemoryUserRepository()
    registerUseCase = new RegisterUseCase(userRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'amanda',
      email: 'amand12@gmail.com',
      password: '1234565',
    })

    // espero que receba um id com qualquer string
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    // executando uma criação
    const { user } = await registerUseCase.execute({
      name: 'amanda',
      email: 'amand12@gmail.com',
      password: '1234565',
    })

    // verificando se a senha hash bate
    const isPasswordCorrectlyHashed = await compare(
      '1234565',
      user.password_hash,
    )

    // se for true é porque a senha é igual
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register a user with same email', async () => {
    const email = 'amand12@gmail.com'

    await registerUseCase.execute({
      name: 'amanda',
      email,
      password: '1234565',
    })

    // espero que essa promise dê erro com a instância de erro
    await expect(() =>
      registerUseCase.execute({
        name: 'amanda',
        email,
        password: '1234565',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
