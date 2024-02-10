import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

// tipando as variáveis
let checkInRepository: InMemoryCheckInRepository
let fetchUserCheckInHistoryUseCase: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  // instânciando os repositórios em cada teste
  beforeEach(async () => {
    // passando o repositório temporário criado
    checkInRepository = new InMemoryCheckInRepository()
    fetchUserCheckInHistoryUseCase = new GetUserMetricsUseCase(
      checkInRepository,
    )
  })

  it('should be able to get user check in count from metrics', async () => {
    // check in de user
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await fetchUserCheckInHistoryUseCase.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
