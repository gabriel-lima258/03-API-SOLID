// passo as variáveis de .env
import 'dotenv/config'
import { z } from 'zod'

// construindo os tipos das variáveis com zod
const esvSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

// validando as variáveis de dentro de .env
const _env = esvSchema.safeParse(process.env)

// caso uma variável não seja correta
if (_env.success === false) {
  console.error('❌  Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

// caso sucesso criar uma variável env com os dados
export const env = _env.data
