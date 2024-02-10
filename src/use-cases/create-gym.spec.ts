import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

// tipando as variáveis
let gymRepository: InMemoryGymRepository
let gymUseCase: CreateGymUseCase

describe('Gym Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(() => {
    // passando o repositório temporário criado
    gymRepository = new InMemoryGymRepository()
    gymUseCase = new CreateGymUseCase(gymRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await gymUseCase.execute({
      title: 'Gym-01',
      description: null,
      phone: null,
      latitude: -16.0525144,
      longitude: -47.970301,
    })

    // espero que receba um id com qualquer string
    expect(gym.id).toEqual(expect.any(String))
  })
})
