const checkEmail = (email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return `${true}`;
    }
  }
};

checkEmail();
// find user by Email
const findUserEmail = (email) => {
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
};

// retrieving a user from the database
const getUser = (id) => {
  for (let user in users) {
    if (users[user].id === id) {
      return users[user];
    }
  }
};
//
// module.exports = { checkEmail, findUserEmail, getUser };
