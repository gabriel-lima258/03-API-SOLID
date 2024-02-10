import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckInUseCase } from './check-in'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

// tipando as variáveis
let checkInRepository: InMemoryCheckInRepository
let gymRepository: InMemoryGymRepository
let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(async () => {
    // passando o repositório temporário criado
    checkInRepository = new InMemoryCheckInRepository()
    gymRepository = new InMemoryGymRepository()
    checkInUseCase = new CheckInUseCase(checkInRepository, gymRepository)

    // criando uma gym por causa da dependência checkInUseCase
    await gymRepository.create({
      id: 'gym-01',
      title: 'WorldGyms',
      description: 'bodybuilder',
      phone: '992632008',
      latitude: -16.0525144,
      longitude: -47.970301,
    })

    // dizendo para o vitest que será criado uma data fictícia
    vi.useFakeTimers()
  })

  // depois dos testes as datas voltaram ao valor real
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    // check in de user
    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.0525144,
      userLongitude: -47.970301,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    // criando uma data fictícia
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    // check in de user
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.0525144,
      userLongitude: -47.970301,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.0525144,
        userLongitude: -47.970301,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in differents days', async () => {
    // criando uma data fictícia
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    // check in de user
    await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.0525144,
      userLongitude: -47.970301,
    })

    vi.setSystemTime(new Date(2024, 0, 22, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.0525144,
      userLongitude: -47.970301,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    // check in de gym
    gymRepository.items.push({
      id: 'gym-02',
      title: 'WorldGyms',
      description: 'bodybuilder',
      phone: '992632008',
      latitude: new Decimal(-16.0525144),
      longitude: new Decimal(-47.970301),
    })

    // caso seja maior que 100m o check in vai rejeitar
    await expect(() =>
      checkInUseCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.0525092,
        userLongitude: -47.9728813,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
