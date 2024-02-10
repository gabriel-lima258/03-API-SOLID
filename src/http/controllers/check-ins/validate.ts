import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  // importando o factory de instância de repository
  const validatCheckInUseCase = makeValidateCheckInUseCase()

  // logo, executo a dependência de inversão
  await validatCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
