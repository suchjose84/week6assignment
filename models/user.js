module.exports = (mongoose) => {
  const userSchema = mongoose.Schema({
    username: {
      type: String
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    email: {
      type: String
    },
    password: {
      type: String
    },
    birthDate: {
      type: String
    },
    phone: {
      type: String
    },
    country: {
      type: String
    },
    profileImg: {
      type: String
    }
  }, {
    versionKey: false
  }
  );
  return mongoose.model('users', userSchema);
};