import { gql } from "@apollo/client";



export const GET_REGIMENTS = gql`
  query UserRegiments($userId: ID!) {
    userRegiments(userId: $userId) {
      _id
      name
      workouts {
        instructions
        type
        muscle
        difficulty
        equipment
      }
    }
  }
`;

export const GET_COMPLETED_REGIMENTS = gql`
query CompletedRegiments($completedRegiment: ID!) {
  CompletedRegiments(CompletedRegiment: $completedRegiment) {
    _id
    date
    name
    progressPic
    time
  }
}
`;


export const REGIMENT = gql`
  query Regiment($regiment: ID!) {
    Regiment(regiment: $regiment) {
      _id
      name
      workouts {
        instructions
        type
        muscle
        difficulty
        equipment
      }
    }
  }
`;



export const GET_USER_BY_ID = gql`
query OneUser($userId: ID!) {
  oneUser(userId: $userId) {
    _id
    userName
    regiment {
      name
      _id
      workouts {
        difficulty
        equipment
        instructions
        muscle
        name
        type
      }
    }
    completedRegiments {
      _id
      name
      date
      time
      progressPic
    }
    password
    pfp
  }
}
`;


