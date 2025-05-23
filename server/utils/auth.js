const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');


const secret = process.env.JWT_SECRET || 'xyzp9036';
const expiration = '2000h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: function ({ userName, password, _id }) {
    const payload = { userName, password, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
}
};