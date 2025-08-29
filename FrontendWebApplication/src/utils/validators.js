import validator from 'validator';

// PUBLIC_INTERFACE
export function validateRegistration({ email, mobile, username, password }) {
  /** Returns an object of field errors if invalid */
  const errors = {};
  if (!email && !mobile) errors.contact = 'Provide email or mobile';
  if (email && !validator.isEmail(email)) errors.email = 'Invalid email';
  if (mobile && !validator.isMobilePhone(mobile + '', undefined, { strictMode: false })) errors.mobile = 'Invalid mobile';
  if (!username || username.length < 3) errors.username = 'Username too short';
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 chars';
  return errors;
}

// PUBLIC_INTERFACE
export function validateLogin({ identifier, password }) {
  const errors = {};
  if (!identifier) errors.identifier = 'Email or mobile is required';
  if (!password) errors.password = 'Password is required';
  return errors;
}
