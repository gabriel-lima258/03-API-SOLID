import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { create } from './create'
import { validate } from './validate'
import { history } from './history'
import { metrics } from './metrics'
import { verifyUserRole } from '@/http/middleware/verify-user-role'

export async function checkInsRoutes(app: FastifyInstance) {
  // chamando a verificacao de token para todas rotas
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  // passando o id da academia junto com a rota
  app.post('/gyms/:gymId/check-ins', create)
  // so pode validar se for admin
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
