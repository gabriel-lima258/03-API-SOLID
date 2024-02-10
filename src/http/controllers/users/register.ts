import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  // inversão de dependência
  try {
    // importando o factory de instância de repository
    const registerUseCase = makeRegisterUseCase()

    // logo, executo a dependência de inversão
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    // se meu erro for uma tratativa desse método de erro criado
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
