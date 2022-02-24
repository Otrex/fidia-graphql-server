const { GraphQLScalarType } = require('graphql');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = new GraphQLScalarType({
  name: 'ObjectId',
  parseValue(value) {
    return ObjectId(value);
  },
  serialize(value) {
    return value.toString();
  },
});
