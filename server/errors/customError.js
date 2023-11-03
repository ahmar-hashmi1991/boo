class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 404;
    }
  }
  
class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = 400;
    }
  }

  module.exports ={
    NotFoundError,
    ValidationError
  }