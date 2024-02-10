import { FastifyInstance } from 'fastify'
import { register } from './register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // atualiza um novo refresh token
  app.patch('/token/refresh', refresh)

  // if the user is authenticated
  // passando a verificacao de token onRequest
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
