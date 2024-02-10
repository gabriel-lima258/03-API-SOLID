import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/routes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInsRoutes } from './http/controllers/check-ins/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

// criando uma requisicao JWT com suas configuracoes
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false, // nao vai ser validado
  },
  sign: {
    expiresIn: '10m', // 10 min
  },
})

// aplicando o cookie no segundo token
app.register(fastifyCookie)

// indicando um arquivo de rotas para o fastify
app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

// tratativa de handler erro global
app.setErrorHandler((error, _, reply) => {
  // se for um erro de validação de dados return
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  // se for um ambiente diferente jogar um erro no terminal server
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  // se for um erro desconhecido
  return reply.status(500).send({ message: 'Internal server error.' })
})
