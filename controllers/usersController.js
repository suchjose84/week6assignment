const mongodb = require('../db/connect');
const {
  ObjectId
} = require('mongodb');

//get all user data
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: Successful operation
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await mongodb.getDb().db('eggsandmore').collection('users').find().toArray();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }

};
//get 1 user
exports.getUser = async (req, res, next) => {
  const userName = req.params.userName;
  try {
    const user = await mongodb.getDb().db('eggsandmore').collection('users').findOne({userName: userName});
    if (!user) {
      return res.status(404).json({
        message: 'Contact not found'
      });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
//create 1 user
exports.addUser = async (req, res, next) => {
  try {
    const user = {
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate,
      phone: req.body.phone,
      country: req.body.country,
      profileImg: req.body.profileImg

    };
    const result = await mongodb.getDb().db('eggsandmore').collection('users').insertOne(user);
    res.status(201).json({
      id: result.insertedId,
      userName: user.userName
    });
  } catch (error) {
    next(error);
  }
};

//edit 1 user
exports.editUser = async (req, res, next) => {
  try {
    const userName = req.params.userName;
    const updatedUser = {
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      birthDate: req.body.birthDate,
      phone: req.body.phone,
      country: req.body.country,
      profileImg: req.body.profileImg
    };

    const result = await mongodb
      .getDb().db('eggsandmore').collection('users').updateOne({ userName }, { $set: updatedUser });

    res.status(200).json({
      message: 'User updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const userName = req.params.userName;
  try {
    const result = await mongodb.getDb().db('eggsandmore').collection('users').deleteOne({ userName });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// exports.deleteAllUsers = async (req, res, next) => {
//   try {
//     const result = await mongodb.getDb().db('eggsandmore').collection('users').deleteMany({});

//     if (result.deletedCount === 0) {
//       return res.status(404).json({
//         message: 'No users found'
//       });
//     }

//     res.status(200).json({
//       message: 'All users deleted successfully'
//     });
//   } catch (error) {
//     next(error);
//   }
// };


