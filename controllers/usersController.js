const db = require('../models');
const User = db.user;
const { emailSchema, passwordSchema } = require('../util/validation_schema');

//get all user data
module.exports.getAllUsers = (req, res, next) => {
  try {
    User.find({})
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving users.'
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    
    if (!user) {
      res.status(404).send({ message: 'User not found' });
      return;
    }
    
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving users.'
    });
  }
};

module.exports.addUser = async (req, res) => {
  try {
    const { error: emailError } = emailSchema.validate(req.body.email);
    if (emailError) {
      res.status(400).send({ message: emailError.details[0].message });
      return;
    }

    const { error: passwordError } = passwordSchema.validate(req.body.password);
    if (passwordError) {
      res.status(400).send({ message: passwordError.details[0].message });
      return;
    }
    if (!req.body.username || !req.body.password || !req.body.email) {
      res.status(400).send({ message: 'username, password, and email cannot be empty!' });
      return;
    }

    const username = req.body.username;
    const email = req.body.email;

    const existingUser = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (existingUser) {
      res.status(400).send({ message: 'username or email already exists' });
      return;
    }

    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate,
      phone: req.body.phone,
      country: req.body.country,
      profileImg: req.body.profileImg
    });

    const savedUser = await newUser.save();
    res.status(201).send(savedUser).send({message: 'user successfully added'});
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const { username } = req.params;
    const {
      username: newUsername,
      email: newEmail,
      password,
      firstName,
      lastName,
      birthDate,
      phone,
      country,
      profileImg
    } = req.body;

    const { error: emailError } = emailSchema.validate(newEmail);
    if (emailError) {
      return res.status(400).send({ message: emailError.details[0].message });
    }
    const { error: passwordError } = passwordSchema.validate(password);
    if (passwordError) {
      return res.status(400).send({ message: passwordError.details[0].message });
    }

    if (!username) {
      return res.status(400).send({ message: 'Invalid username supplied' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // checkif there are existing
    if (newUsername !== user.username) {
      const existingUsername = await User.findOne({ username: newUsername });
      if (existingUsername) {
        return res.status(409).send({ message: 'Username already exists' });
      }
      user.username = newUsername;
    }
    // checkif there are existing
    if (newEmail !== user.email) {
      const existingEmail = await User.findOne({ email: newEmail });
      if (existingEmail) {
        return res.status(409).send({ message: 'Email already exists' });
      }
      user.email = newEmail;
    }

    if (password) {
      user.password = password;
    }

    // These lines use the logical OR (||) operator to set the values. 
    //The logical OR operator returns the first truthy value it encounters. In this case, if the value from the 
    //request body is truthy (not null, undefined, false, 0, or an empty string), it will be assigned to the 
    //corresponding property of the user object. Otherwise, if the value from the request body is falsy, the 
    //existing value of the property (user.firstName, user.lastName, etc.) will be retained.

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.birthDate = birthDate || user.birthDate;
    user.phone = phone || user.phone;
    user.country = country || user.country;
    user.profileImg = profileImg || user.profileImg;

    await user.save();

    res.status(200).send(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const username = req.params.username;
    if (!username) {
      return res.status(400).send({ message: 'Invalid username supplied' });
    }
    
    const result = await User.deleteOne({ username: username });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    res.status(204).send({message: 'User deleted'});
  } catch (err) {
    res.status(500).send({ message: 'Some error occurred while deleting the user', error: err });
  }
};

// module.exports.deleteAll = async (req, res) => {
//   try {
//     const result = await User.deleteMany();
//     if (result.deletedCount > 0) {
//       res.status(204).send();
//     } else {
//       res.status(404).send({ message: 'No users found' });
//     }
//   } catch (err) {
//     res.status(500).json(err || 'Some error occurred while deleting the users.');
//   }
// };



