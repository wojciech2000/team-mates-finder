const validateRegisterInput = (
  login,
  email,
  password,
  confirmPassword,
  server,
) => {
  const errors = {};

  //Login
  if (login.trim() === "") {
    errors.login = "Login must not be empty";
  } else if (login.length < 5) {
    errors.login = "Login must at least contains 5 characters";
  }

  //Email
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }

  //Password
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password.length < 5) {
    errors.password = "Password must at least contains 5 characters";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match";
  }

  //Server
  if (server === "") {
    errors.server = "Server must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateLoginInput = (login, password) => {
  const errors = {};

  //Login
  if (login.trim() === "") {
    errors.login = "Login must not be empty";
  }

  //Password
  if (password === "") {
    errors.password = "Password must not be empty";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {validateRegisterInput, validateLoginInput};
