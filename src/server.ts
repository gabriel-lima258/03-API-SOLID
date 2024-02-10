import { app } from './app'
import { env } from './env'

app
  .listen({
    host: '0.0.0.0', // este host deixa mais acessível o acesso para futuros fronts
    port: env.PORT,
  })
  .then(() => {
    console.log(`🖥️  HTTP server running on port ${env.PORT}`)
  })
