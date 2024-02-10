import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

// tipando as variáveis
let gymsRepository: InMemoryGymRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(async () => {
    // passando o repositório temporário criado
    gymsRepository = new InMemoryGymRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    // academia perto
    await gymsRepository.create({
      title: 'near gym',
      description: null,
      phone: null,
      latitude: -16.0053338,
      longitude: -47.9963359,
    })

    // academia longe
    await gymsRepository.create({
      title: 'far gym',
      description: null,
      phone: null,
      latitude: -15.6337207,
      longitude: -47.6455277,
    })

    // minha localização
    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -15.9975111,
      userLongitude: -47.999245,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'near gym' })])
  })
})
