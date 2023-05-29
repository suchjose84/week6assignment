// const mongodb = require('../db/connect');
// const {ObjectId} = require('mongodb');
const db = require('../models');
const User = db.user;
const passwordUtil = require('../util/validation_schema');

//get all user data

// exports.getAllUsers = async (req, res, next) => {
//   try {
//     const users = await mongodb.getDb().db('eggsandmore').collection('users').find().toArray();
//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }

// };
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

//get 1 user
// exports.getUser = async (req, res, next) => {
//   const userName = req.params.userName;
//   try {
//     const user = await mongodb.getDb().db('eggsandmore').collection('users').findOne({userName: userName});
//     if (!user) {
//       return res.status(404).json({
//         message: 'Contact not found'
//       });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     next(err);
//   }
// };
module.exports.getUser = (req, res, next) => {
  try {
    const username = req.params.username;
    User.find({ username: username })
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


//create 1 user
// exports.addUser = async (req, res, next) => {
//   try {
//     const user = {
//       userName: req.body.userName,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       password: req.body.password,
//       birthDate: req.body.birthDate,
//       phone: req.body.phone,
//       country: req.body.country,
//       profileImg: req.body.profileImg

//     };
//     const result = await mongodb.getDb().db('eggsandmore').collection('users').insertOne(user);
//     res.status(201).json({
//       id: result.insertedId,
//       userName: user.userName
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports.addUser = (req, res) => {
//   try {
//     if (!req.body.username || !req.body.password || !req.body.email) {
//       res.status(400).send({ message: 'Content can not be empty!' });
//       return;
//     }
//     const password = req.body.password;
//     const passwordCheck = passwordUtil.passwordPass(password);
//     if (passwordCheck.error) {
//       res.status(400).send({ message: passwordCheck.error });
//       return;
//     }
//     const user = new User(req.body);
//     user
//       .save()
//       .then((data) => {
//         console.log(data);
//         res.status(201).send(data);
//       })
//       .catch((err) => {
//         res.status(500).send({
//           message: err.message || 'Some error occurred while creating the user.'
//         });
//       });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
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
      res.status(400).send({ message: 'Content can not be empty!' });
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
      res.status(400).send({ message: 'Username or email already exists' });
      return;
    }

    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }

    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};


//edit 1 user
// exports.editUser = async (req, res, next) => {
//   try {
//     const userName = req.params.userName;
//     const updatedUser = {
//       userName: req.body.userName,
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       email: req.body.email,
//       password: req.body.password,
//       birthDate: req.body.birthDate,
//       phone: req.body.phone,
//       country: req.body.country,
//       profileImg: req.body.profileImg
//     };

//     const result = await mongodb
//       .getDb().db('eggsandmore').collection('users').updateOne({ userName }, { $set: updatedUser });

//     res.status(200).json({
//       message: 'User updated successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };
module.exports.editUser = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }
    User.findOne({ username: username }, function (err, user) {
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

// exports.deleteUser = async (req, res, next) => {
//   const userName = req.params.userName;
//   try {
//     const result = await mongodb.getDb().db('eggsandmore').collection('users').deleteOne({ userName });

//     if (result.deletedCount === 0) {
//       return res.status(404).json({
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       message: 'User deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };

module.exports.deleteUser = async (req, res) => {
  try {
    const username = req.params.username;
    if (!username) {
      res.status(400).send({ message: 'Invalid Username Supplied' });
      return;
    }
    User.deleteOne({ username: username }, function (err, result) {
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



