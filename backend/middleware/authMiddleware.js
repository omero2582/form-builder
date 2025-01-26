import { AuthenticationError } from "../errors/errors.js";

// move user req to a middleware and run it before every route
  export const authMandatory = (req, res, next) => {
    if(!req.isAuthenticated()){
      throw new AuthenticationError('You must be logged in to access this resource.')
    }
    return next();
  }
  