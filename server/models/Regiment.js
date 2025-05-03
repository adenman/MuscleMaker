const { Schema, model } = require('mongoose');

const regimentSchema = new Schema({
  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  workouts: [{
    name: {
      type: String,
    },
    instructions: {
      type: String,
    },
    type: {
      type: String,
    },
    muscle: {
      type: String,
    },
    difficulty: {
      type: String,
    },
    equipment: {
      type: String,
    }
  }]
});

const Regiment = model('regiment', regimentSchema);

module.exports = Regiment;
