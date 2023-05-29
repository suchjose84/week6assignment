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
    const userName = req.params.userName;
    const user = await User.findOne({ userName: userName });
    
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
    if (!req.body.userName || !req.body.password || !req.body.email) {
      res.status(400).send({ message: 'Username, password, and email cannot be empty!' });
      return;
    }

    const userName = req.body.userName;
    const email = req.body.email;

    const existingUser = await User.findOne({
      $or: [
        { userName: userName },
        { email: email }
      ]
    });

    if (existingUser) {
      res.status(400).send({ message: 'Username or email already exists' });
      return;
    }

    const newUser = new User({
      userName: req.body.userName,
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
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.editUser = async (req, res) => {
  try {
    const userName = req.params.userName;
    if (!userName) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }
    User.findOne({ username: userName }, function (err, user) {
      user.userName = req.body.userName,
      user.firstName = req.body.firstName,
      user.lastName = req.body.lastName,
      user.email = req.body.email,
      user.password = req.body.password,
      user.birthDate = req.body.birthDate,
      user.phone = req.body.phone,
      user.country = req.body.country,
      user.profileImg = req.body.profileImg
      user.save(function (err) {
        if (err) {
          res.status(500).json(err || 'Some error occurred while updating the contact.');
        } else {
          res.status(204).send();
        }
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const userName = req.params.userName;
    if (!userName) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    User.deleteOne({ username: userName }, function (err, result) {
      if (err) {
        res.status(500).json(err || 'Some error occurred while deleting the contact.');
      } else {
        res.status(204).send(result);
      }
    });
  } catch (err) {
    res.status(500).json(err || 'Some error occurred while deleting the contact.');
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



