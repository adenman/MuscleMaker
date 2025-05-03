const { Schema, model } = require('mongoose');

const CompletedRegimentSchema = new Schema({
  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  progressPic:{
    type: String
  },
  time: {
    type: String
  },
  date: {
    type: String,
    
  },
});

const CompleatedRegiment = model('CompletedRegiment', CompletedRegimentSchema);

module.exports = CompleatedRegiment;
