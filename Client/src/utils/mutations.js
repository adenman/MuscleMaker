import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation addUser($userName: String!, $password: String!) {
    addUser(userName: $userName, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($userId: ID!, $userName: String, $password: String, $pfp: String) {
  updateUser(userId: $userId, userName: $userName, password: $password, pfp: $pfp) {
    _id
    userName
    password
    pfp
  }
}
`;

export const LOGIN = gql`
  mutation login($userName: String!, $password: String!) {
    login(userName: $userName, password: $password) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_REGIMENT_TO_USER = gql`
  mutation AddRegimentToUser($userId: ID!, $regimentId: ID!) {
    addRegimentToUser(userId: $userId, regimentId: $regimentId) {
      _id
      userName
      regiment {
        _id
        name
      }
    }
  }
`;

export const COMPLETED_REGIMENT = gql`
  mutation AddCompletedRegiment($name: String!, $progressPic: String, $date: String, $time: String) {
  addCompletedRegiment(name: $name, progressPic: $progressPic, date: $date, time: $time) {
    _id
    date
    name
    progressPic
    time
  }
}
`;

export const ADD_COMPLETED_REGIMENT_TO_USER = gql`
  mutation AddCompletedRegimentToUser($userId: ID!, $completedRegimentId: ID!) {
    addCompletedRegimentToUser(userId: $userId, completedRegimentId: $completedRegimentId) {
      _id
      completedRegiments {
        _id
        date
        name
        progressPic
        time
      }
    }
  }
`;

export const ADD_REGIMENT = gql`
  mutation AddRegiment($name: String!, $workouts: [WorkoutInput]) {
    addRegiment(name: $name, workouts: $workouts) {
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






export const SIGN_OUT = gql`
  mutation SignOut {
    logout {
      success
      message
    }
  }
`;
