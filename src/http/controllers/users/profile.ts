import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // pegando o use case de profile
  const getUserProfile = makeGetUserProfileUseCase()

  // acessando todos os dados de user e pegando id
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  // devolvendo todos os dados mas excluindo password
  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
