const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    userName: String
    pfp: String
    password: String
    regiment: [Regiment]
    completedRegiments: [CompletedRegiment] 
  }

  type Workout {
    name: String
    instructions: String
    type: String
    muscle: String
    difficulty: String
    equipment: String
  }

  type Regiment {
    _id: ID
    name: String
    workouts: [Workout]
  }

  type CompletedRegiment {
  _id: ID
  name: String
  progressPic: String
  date: String
  time: String
}

  input WorkoutInput {
    name: String
    instructions: String
    type: String
    muscle: String
    difficulty: String
    equipment: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    User: User!
    oneUser(userId: ID!): User
    userRegiments(userId: ID!): [Regiment]
    Regiment(regiment: ID!): Regiment
    CompletedRegiments(CompletedRegiment: ID!): [CompletedRegiment]
  }

  type Mutation {
    addUser(userName: String!, password: String!): Auth
    updateUser(userId: ID!, userName: String, password: String, pfp: String): User
    addRegimentToUser(userId: ID!, regimentId: ID!): User
    addRegiment(name: String!, workouts: [WorkoutInput]): Regiment
    addCompletedRegimentToUser(userId: ID!, completedRegimentId: ID!): User  # Fixed typo in ID variable name
    addCompletedRegiment(name: String!, progressPic: String, date: String, time: String): CompletedRegiment
    removeRegimentFromUser(userId: ID!, regimentId: ID!): User
    login(userName: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
