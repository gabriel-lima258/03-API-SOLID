import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

// tipando as variáveis
let gymsRepository: InMemoryGymRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(async () => {
    // passando o repositório temporário criado
    gymsRepository = new InMemoryGymRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search a gym by search', async () => {
    // check in de user
    await gymsRepository.create({
      title: 'black skull gym',
      description: null,
      phone: null,
      latitude: -16.0525144,
      longitude: -47.970301,
    })

    await gymsRepository.create({
      title: 'iron berg',
      description: null,
      phone: null,
      latitude: -16.0525144,
      longitude: -47.970301,
    })

    // buscando uma academia pelo nome iron berg
    const { gyms } = await searchGymsUseCase.execute({
      querry: 'iron berg',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'iron berg' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      // criando várias academias
      await gymsRepository.create({
        title: `iron berg ${i}`,
        description: null,
        phone: null,
        latitude: -16.0525144,
        longitude: -47.970301,
      })
    }

    const { gyms } = await searchGymsUseCase.execute({
      querry: 'iron berg',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      // espero que liste as duas ultimas academias da page 2
      expect.objectContaining({ title: 'iron berg 21' }),
      expect.objectContaining({ title: 'iron berg 22' }),
    ])
  })
})
