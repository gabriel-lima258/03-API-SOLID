import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
// importa uma funcao de chamar o terminal pelo node
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

// criando uma conexao com o prisma
const prisma = new PrismaClient()

// funcao para criar umnovo schema do banco de dados
function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  // url vai ler uma url como essa
  // "postgresql://docker:docker@localhost:5432/apisolid?schema=public"
  const url = new URL(process.env.DATABASE_URL)

  // substituindo a variavel schema da url
  url.searchParams.set('schema', schema)

  // retornando a url em string
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // criando um schema aleatorio
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    // substituindo a variavel env database URL pela nova
    process.env.DATABASE_URL = databaseURL

    // chamando pelo terminal a migration do banco de dados
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // apagando o schema do banco de dados apos o teste
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        )
        // disconectando a conexao com o prisma
        await prisma.$disconnect()
      },
    }
  },
}
