import { FastifyReply, FastifyRequest } from 'fastify'

// funcao que pega um paramentro de role para checagem
export function verifyUserRole(rolerToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // pegando a role de user
    const { role } = request.user

    if (role !== rolerToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}
