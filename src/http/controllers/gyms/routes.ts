import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'
import { create } from './create'
import { search } from './search'
import { nearby } from './nearby'
import { verifyUserRole } from '@/http/middleware/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  // chamando a verificacao de token para todas rotas
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)

  // so pode criar uma gym se tiver uma role de admin
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
