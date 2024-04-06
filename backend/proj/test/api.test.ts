import axios from 'axios'
axios.defaults.validateStatus = () => true

test('Deve criar a conta de um motorista', async () => {
  const input = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const responseSignup = await axios.post('http://localhost:3000/signup', input)
  const outputSignup = responseSignup.data
  expect(outputSignup.accountId).toBeTruthy()
  const responseGetAccount = await axios.get(
    `http://localhost:3000/accounts/${outputSignup.accountId}`,
  )
  const outputGetAccount = responseGetAccount.data
  expect(outputGetAccount.name).toBe(input.name)
  expect(outputGetAccount.email).toBe(input.email)
  expect(outputGetAccount.cpf).toBe(input.cpf)
  expect(outputGetAccount.car_plate).toBe(input.carPlate)
  expect(outputGetAccount.is_driver).toBeTruthy()
})

test('Deve solicitar uma corrida', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const responseRequestRide = await axios.post(
    `http://localhost:3000/request_ride`,
    inputRequestRide,
  )
  const outputRequestRide = responseRequestRide.data
  expect(outputRequestRide.rideId).toBeDefined()
  const responseGetRide = await axios.get(
    `http://localhost:3000/rides/${outputRequestRide.rideId}`,
  )
  const outputGetRide = responseGetRide.data
  expect(responseGetRide.status).toBe(200)
  expect(outputGetRide.passenger_id).toBe(outputSignup.accountId)
  expect(outputGetRide.ride_id).toBe(outputRequestRide.rideId)
  expect(+outputGetRide.from_lat).toBe(inputRequestRide.fromLat)
  expect(+outputGetRide.from_long).toBe(inputRequestRide.fromLong)
  expect(+outputGetRide.to_lat).toBe(inputRequestRide.toLat)
  expect(+outputGetRide.to_long).toBe(inputRequestRide.toLong)
  expect(outputGetRide.status).toBe('requested')
  expect(outputGetRide.date).toBeDefined()
})
test('Não deve solicitar uma corrida senão for passageiro', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: false,
    isDriver: true,
    carPlate: 'ABC1234',
  }
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  const responseRequestRide = await axios.post(
    `http://localhost:3000/request_ride`,
    inputRequestRide,
  )
  const outputRequestRide = responseRequestRide.data
  expect(responseRequestRide.status).toBe(422)
  expect(outputRequestRide.message).toBe('Account is not from a passenger')
})
test('Não deve solicitar uma corrida se o passageiro tiver outra corrida ativa', async () => {
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@mail.com`,
    cpf: '987.654.321-00',
    isPassenger: true,
  }
  const responseSignup = await axios.post(
    'http://localhost:3000/signup',
    inputSignup,
  )
  const outputSignup = responseSignup.data
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  }
  await axios.post(`http://localhost:3000/request_ride`, inputRequestRide)
  const responseRequestRide = await axios.post(
    `http://localhost:3000/request_ride`,
    inputRequestRide,
  )
  const outputRequestRide = responseRequestRide.data
  expect(responseRequestRide.status).toBe(422)
  expect(outputRequestRide.message).toBe('Passenger has an active ride')
})