import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate check-ins', async () => {
    // pegando token da autenticacao de user
    const { token } = await createAndAuthenticateUser(app, true)

    // pegando o primeiro user criado
    const user = await prisma.user.findFirstOrThrow()

    // criando uma academia pelo prisma
    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -16.0525144,
        longitude: -47.970301,
      },
    })

    // criando check-in
    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    const response = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    // validando um check-in
    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    })

    // apos validar, espero validated_at esteja preenchido
    expect(checkIn.validated_at).toEqual(expect.any(Date))
  })
})
