const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema(
  {
    pfp: {
      type: String,
      default: '/defaultpfp.PNG', // You can set a default image
    },
    
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    
    regiments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'regiment',
        default: [],
      },
    ],
    completedRegiments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'CompletedRegiment',
        default: [],
      },
    ],
   
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};



const User = model('User', userSchema);

module.exports = User;
