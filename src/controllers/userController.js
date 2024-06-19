const getAllUsers = (req, res) => {
    res.send('Get all users');
};

const createUser = (req, res) => {
    res.send('Create a new user');
};

module.exports = {
    getAllUsers,
    createUser,
};
