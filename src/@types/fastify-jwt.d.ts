import '@fastify/jwt'

// declarando uma tipagem de uma classe em ts
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      role: 'ADMIN' | 'MEMBER'
    }
  }
}
