import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInHistoryUseCase } from './fetch-user-check-ins-history'

// tipando as variáveis
let checkInRepository: InMemoryCheckInRepository
let fetchUserCheckInHistoryUseCase: FetchUserCheckInHistoryUseCase

describe('Fetch User Check In History Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(async () => {
    // passando o repositório temporário criado
    checkInRepository = new InMemoryCheckInRepository()
    fetchUserCheckInHistoryUseCase = new FetchUserCheckInHistoryUseCase(
      checkInRepository,
    )
  })

  it('should be able to fetch user check in history', async () => {
    // check in de user
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch pagineted check in history', async () => {
    // check in de paginação até 20
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
