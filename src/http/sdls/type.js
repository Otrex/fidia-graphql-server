const { gql } = require('apollo-server-express');

module.exports = gql`
scalar Date
scalar ObjectId

type Query {
  hello: String
  date: Date
}

type ErrorType {
  message: String
}

type AuthSuccessPayload {
  token: String
  isVerified: Boolean
  message: String
  user: User!
}

type MessageType {
  message: String
}

type VerifyPayload {
  user: User!
  message: String
}

type User {
  _id: ObjectId
  firstName: String
  lastName: String
  phoneNumber: String
  email: String
  isVerified: Boolean
  verifiedAt: Date
  lastLoggedIn: Date
}
`