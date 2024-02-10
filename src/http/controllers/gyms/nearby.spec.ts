import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search a nearby gym', async () => {
    // pegando token da autenticacao de user
    const { token } = await createAndAuthenticateUser(app, true)

    // academia perto
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'Any description',
        phone: '992712990',
        latitude: -16.0053338,
        longitude: -47.9963359,
      })

    // academia longe
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Typescript Gym',
        description: 'Any description',
        phone: '992712990',
        latitude: -15.6337207,
        longitude: -47.6455277,
      })

    // testando uma academia proxima
    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -16.0053338,
        longitude: -47.9963359,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
