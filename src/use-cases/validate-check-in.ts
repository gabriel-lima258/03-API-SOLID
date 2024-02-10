import { CheckInRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validate-error'

// interface de dados de requisição
interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

// interface de dados de resposta
interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  // criando a dependência de checkIn repository
  constructor(private checkInRepository: CheckInRepository) {}

  // passando parâmetro de request e uma promise de response
  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    // verificação se check in existe
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    // validacao de data apos 20 minutos
    // distancia de agora com a data de criacao usando diff para comparar
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError()
    }

    // se encontrar, validar o check in
    checkIn.validated_at = new Date()

    // salva seu novo check in
    await this.checkInRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
