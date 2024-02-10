// chama uma função para o uso de uma tabela prisma
import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  // log monitora as requisições feitas
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
