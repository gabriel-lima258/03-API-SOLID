import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  // inversão de dependência
  try {
    // importando factory de repositório
    const authenticateUseCase = makeAuthenticateUseCase()

    // logo, executo a dependência de inversão
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // criando um token de autenticacao
    // Primeiro parametro => payload
    // Segundo parametro => sign com id do user
    const token = await reply.jwtSign(
      {
        role: user.role, // definindo a role no token
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // refresh token sera o 2 token com expiracao maior
    const refreshToken = await reply.jwtSign(
      {
        role: user.role, // salvando a role no token
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // 7 days
        },
      },
    )

    // enviando o segundo token dentro do cookie,
    // esse segundo token nao e visivel caso de hackers
    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // todas rotas tem acesso
        secure: true, // HTTPs
        sameSite: true, // acessivel ao msm dominio
        httpOnly: true, // acessivel somente ao backend
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    // se meu erro for uma tratativa desse método de erro criado
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
