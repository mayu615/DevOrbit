// src/utils/validateForm.js

/**
 * Validates a form object based on required fields
 * @param {Object} data - Form data object
 * @param {Object} rules - Validation rules { fieldName: "required|email|min:6" }
 * @returns {Object} errors - { fieldName: "Error message" }
 */
export function validateForm(data, rules) {
  const errors = {};

  for (const field in rules) {
    const validations = rules[field].split("|");
    const value = (data[field] || "").toString().trim();

    validations.forEach((rule) => {
      if (rule === "required" && !value) {
        errors[field] = `${field} is required`;
      }

      if (rule === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = "Invalid email format";
        }
      }

      if (rule.startsWith("min:") && value) {
        const minLength = parseInt(rule.split(":")[1], 10);
        if (value.length < minLength) {
          errors[field] = `${field} must be at least ${minLength} characters`;
        }
      }

      if (rule.startsWith("max:") && value) {
        const maxLength = parseInt(rule.split(":")[1], 10);
        if (value.length > maxLength) {
          errors[field] = `${field} must be less than ${maxLength} characters`;
        }
      }
    });
  }

  return errors;
}
