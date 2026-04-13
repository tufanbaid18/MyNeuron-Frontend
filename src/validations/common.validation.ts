type PhoneValidatorOptions = {
  required?: boolean;
  allowFormatting?: boolean; // allow spaces, dashes, etc.
  minLength?: number; // default 8
  maxLength?: number; // default 15
};

export const PhoneValidator = (options?: PhoneValidatorOptions) => {
  const {
    required = true,
    allowFormatting = false,
    minLength = 8,
    maxLength = 15,
  } = options || {};

  return async (_: any, value?: string) => {
    if (!value) {
      if (required) {
        return Promise.reject(new Error("Contact number is required"));
      }
      return Promise.resolve();
    }

    // if (!/^\+?\d+$/.test(value)) {
    //   return Promise.reject(
    //     new Error("Only digits and optional leading + are allowed"),
    //   );
    // }

    // normalize if formatting allowed
    const cleaned = allowFormatting ? value.replace(/[^\d+]/g, "") : value;

    const regex = new RegExp(
      `^\\+?[1-9]\\d{${minLength - 1},${maxLength - 1}}$`,
    );

    if (!regex.test(cleaned)) {
      return Promise.reject(
        new Error("Enter a valid phone number (e.g., +919876543210)"),
      );
    }

    return Promise.resolve();
  };
};
