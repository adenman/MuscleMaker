import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    const token = this.getToken();
    try {
      return token ? decode(token) : null;
    } catch (err) {
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();
    // Return false if there's no token or if it's expired
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return true;
    }
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();