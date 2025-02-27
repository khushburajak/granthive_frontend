// Email validation
export const isEmail = (value) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(value) ? null : "Invalid email address";
};

// Password validation
export const validPassword = (password) => {
  const lengthCheck = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[\W_]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);

  if (!lengthCheck) return "Password must be at least 8 characters.";
  if (!hasNumber) return "Password must have at least one number.";
  if (!hasSpecialChar) return "Password must have at least one special character.";
  if (!hasLowercase) return "Password must have at least one lowercase letter.";
  if (!hasUppercase) return "Password must have at least one uppercase letter.";

  return ""; // No errors
};

// Confirm password validation
export const checkConfirmPassword = (password, confirmPassword) => {
  return password === confirmPassword ? null : "Passwords do not match.";
};
