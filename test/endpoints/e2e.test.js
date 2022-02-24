const { connect, dropAllCollections } = require("../../src/database");
const supertest = require("supertest");
const app = require("../../src/app");
const faker = require("faker");
const { readFileSync } = require('fs');
const startGraphQLServer = require('../../src/graphqlServer');
const { join } = require("path");


let server;
let graphServer;
let httpServer;
let dbConn;

beforeAll(async () => {
  dbConn = await connect()
  const { 
    url, 
    httpServer, 
    server: graphServer 
  } = await startGraphQLServer(5050);
  server = supertest(url);
})

afterAll(async () => {
  await httpServer?.close()
  await graphServer?.close()
  await dropAllCollections();
  await dbConn?.disconnect()
})

describe("Fidia Test 1", () => {
  let userToken;
  const userClient = {
    "email": faker.internet.email(),
    "password": faker.internet.password(),
  }

  it ("register user", async () => {
    const queryData = {
      query: `mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $phoneNumber: String!) {
        register(firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, password: $password, email: $email) {
          message
        }
      }`,
      variables: {
        ...userClient,
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "phoneNumber": faker.phone.phoneNumber(),
      },
    };
    const res = await server.post('/').send(queryData)
    expect(res.body.data.register).toHaveProperty('message')
  })

  it ("should verify the registered user", async () => {
    const token = readFileSync(join(__dirname, '..', 'email-token.txt')).toString();
    const verificationURL = `?query={verifyEmail(token:"${token.trim()}") {message}}`
    const res = await server.get(`${verificationURL}`);
    expect(res.body.data.verifyEmail).toHaveProperty('message')
  })

  it ("should login the already verified user", async () => {
    const queryData = {
      query: `query Login($email: String!, $password: String!) {
        login(password: $password, email: $email) {
          message
          token
          isVerified
        }
      }`,
      variables: userClient,
    };
    const res = await server.post('/').send(queryData)
    expect(res.body.data.login).toHaveProperty('message')
    expect(res.body.data.login).toHaveProperty('isVerified')
    expect(res.body.data.login).toHaveProperty('token')
    expect(res.body.data.login.isVerified).toEqual(true)
    userToken = res.body.data.login.token
  })

  it ("users client", async () => {
    const queryData = {
      query: `query Users {
        users {
          _id,
          firstName
          lastName
          email
        }
      }`,
      variables: {},
    };
    const res = await server.post('/')
      .set('authorization', `Bearer ${userToken}`)
      .send(queryData)
    
    console.log(res.body);
    expect(res.body.data.users).toHaveLength(1);
    expect(res.body.data.users[0]).toHaveProperty('firstName');
    expect(res.body.data.users[0].email).toEqual(userClient.email);
  })
})



describe("Fidia Test 2", () => {
  let userToken = '';
  const userClient = {
    "email": faker.internet.email(),
    "password": faker.internet.password(),
  }
  

  it ("should register user for not verified test", async () => {
    const queryData = {
      query: `mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $phoneNumber: String!) {
        register(firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, password: $password, email: $email) {
          message
        }
      }`,
      variables: {
        ...userClient,
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "phoneNumber": faker.phone.phoneNumber(),
      },
    };
    const res = await server.post('/').send(queryData)
    expect(res.body.data.register).toHaveProperty('message')
  })

  it ("should login and return unverified token", async () => {
    const queryData = {
      query: `query Login($email: String!, $password: String!) {
        login(password: $password, email: $email) {
          isVerified
          message
          token
        }
      }`,
      variables: userClient,
    };
    
    const res = await server.post('/').send(queryData)
    console.log(res.body);
    expect(res.body.data.login).toHaveProperty('message')
    expect(res.body.data.login).toHaveProperty('isVerified')
    expect(res.body.data.login.isVerified).toEqual(false)
    expect(res.body.data.login).toHaveProperty('token')
    userToken = res.body.data.login.token
  })
  
  it ("not fetch users due to not verified yet", async () => {
    const queryData = {
      query: `query Users {
        users {
          _id,
          firstName
          lastName
          email
        }
      }`,
      variables: {},
    };
    const res = await server.post('/')
      .set('authorization', `Bearer ${userToken}`)
      .send(queryData)
    
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.data.users).toEqual(null);
  })
})
