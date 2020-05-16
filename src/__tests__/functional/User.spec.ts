import createConnection from '../../Database'
import { Connection, getConnection } from 'typeorm'

import test from 'japa'
import request from 'supertest'

import Factory from '../../Database/factory'

import app from '../../app'

let connection: Connection

test.group('User Tests', group => {
  group.before(async () => {
    connection = await createConnection('test-connection')
    await connection.runMigrations()
  })

  group.beforeEach(async () => {
    await connection.query('DELETE FROM users')
  })

  group.after(async () => {
    connection.dropDatabase()
    const mainConnection = getConnection()

    await connection.close()
    await mainConnection.close()
  })

  const name = 'Matheus Henrique'
  const email = 'math@gmail.com'
  const password = '12345a'
  const avatar = 'math.dev'
  const champions = 'Gragas'
  const lanes = 'jungle'
  const media = 'video.mp4'

  test('A - Create User', async assert => {
    const response = await request(app)
      .post('/duo/v1/users')
      .send({
        name,
        email,
        password,
        avatar,
        champions,
        lanes,
        media,
      })
      .expect(200)

    assert.exists(response.body.data.id)
  })

  test('B - List all Users', async assert => {
    const factory = new Factory()
    await factory.manyUsers(5)

    const response = await request(app).get(`/duo/v1/users`).expect(200)

    assert.exists(response.body.data[0])
  })
})