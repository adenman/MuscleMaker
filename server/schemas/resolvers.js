const { User, Regiment, CompletedRegiment } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const bcrypt = require('bcrypt');
const resolvers = {
  Query: {
    User: async () => {
      const users = await User.find({}).populate('jobs');
      return users.map(user => ({
        ...user.toObject(),
        jobs: user.jobs || []
      }));
    },

    oneUser: async (parent, { userId }) => {
      try {
        const user = await User.findById(userId).populate('regiments').populate('completedRegiments');
        if (!user) {
          throw new Error('User not found');
        }
        return user;
      } catch (error) {
        throw new Error(`Failed to fetch user: ${error.message}`);
      }
    },



    Regiment: async (parent, { regiment }) => {
      return Regiment.findOne({ _id: regiment });
    },
    userRegiments: async (parent, { userId }) => {
      const user = await User.findById(userId).populate('regiments');
      return user.regiments;
    },
    
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { userName, password }) => {
      const user = await User.findOne({ userName });
      if (!user) {
        throw new AuthenticationError('Invalid credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = signToken(user);
      return { token, user };
    },

    updateUser: async (parent, { userId, userName, password, pfp }) => {
      try {
        // If password is provided, hash it before updating
        let hashedPassword;
        if (password) {
          const saltRounds = 10;
          hashedPassword = await bcrypt.hash(password, saltRounds);
        }
    
        const updatedUser = await User.findByIdAndUpdate(
          userId, 
          { 
            $set: { 
              ...(userName && { userName: userName }),
              ...(hashedPassword && { password: hashedPassword }),
              ...(pfp && { pfp: pfp })
            } 
          },
          { 
            new: true,  // Return the updated document
            runValidators: true  // Run mongoose validation
          }
        );
    
        if (!updatedUser) {
          throw new Error('User not found');
        }
    
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to update user: ${error.message}`);
      }
    },

    addRegiment: async (parent, { name, workouts }) => {
      const regiment = await Regiment.create({ name, workouts });
      return regiment;
    },

    addCompletedRegiment: async (parent, { name, workouts, progressPic, date, time }) => {
      const completedRegiment = await CompletedRegiment.create({
        name,
        workouts,
        progressPic,
        date,
        time
      });
      return completedRegiment;
    },

    addCompletedRegimentToUser: async (parent, { userId, completedRegimentId }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { completedRegiments: completedRegimentId } },  // Match the schema field name
          { new: true }
        ).populate('completedRegiments');  // Match the schema field name
        
        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to add Completed Regiment: ${error.message}`);
      }
    },

    addRegimentToUser: async (parent, { userId, regimentId }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $addToSet: { regiments: regimentId } },
          { new: true }
        ).populate('regiments');

        if (!updatedUser) {
          throw new Error('User not found');
        }
        return updatedUser;
      } catch (error) {
        throw new Error(`Failed to add regiment: ${error.message}`);
      }
    },
  },
};

module.exports = resolvers;
