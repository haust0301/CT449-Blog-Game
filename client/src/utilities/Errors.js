class Errors {
  constructor() {
    this.errors = {};
  }

  has(key) {
    return this.errors.hasOwnProperty(key);
  }

  record(errors) {
    const newErrors = [];
    errors.forEach((error) => {
      newErrors[error.param] = error.msg;
    });
    this.errors = newErrors;
  }

  get(key) {
    return this.errors[key];
  }

  clear(key) {
    delete this.errors[key];
  }

  clearAll() {
    this.errors = {};
  }
}

export default Errors;
