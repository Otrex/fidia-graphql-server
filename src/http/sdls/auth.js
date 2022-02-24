const { gql } = require('apollo-server-express');

module.exports = gql`
extend type Query {
  login(email: String!, password: String!): AuthSuccessPayload
  resendVerificationEmail(token: String): MessageType
  verifyEmail(token: String): MessageType
}

type Mutation {
  register(
    email: String!,
    password: String!,
    firstName:String!,
    lastName: String!,
    phoneNumber: String!
  ): VerifyPayload
}
`