import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import { useState } from 'react';






function Login(props) {
  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [login] = useMutation(LOGIN);

  async function submitUser(event) {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: {
          userName: userName,
          password: password
        }
      });

      if (data && data.login && data.login.token) {
        localStorage.setItem('id_token', data.login.token);
        window.location.href = '/';
      } else {
        // Original code might have had an alert here, ensure proper handling
        setErrorMessage('Invalid credentials'); // Example using state
      }
    } catch (error) { // <-- Change 'err' to 'error' here
      // Use 'error' to access properties
      const message = error.networkError?.result?.errors?.[0]?.message || error.message;
      setErrorMessage(message);
      console.error('Login error:', message); // Use 'error' here too
    }
  }



  return (
    
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
              <div className="card-body p-5 text-center">
              <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-10 text-uppercase">LOGIN</h2>


                  <form onSubmit={submitUser}>
                    <div data-mdb-input-init className="form-outline form-white mb-4">
                      <input 
                        type="text" 
                        id="typeEmailX" 
                        className="form-control form-control-lg"
                        value={userName}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="typeEmailX">Username</label>
                    </div>

                    <div data-mdb-input-init className="form-outline form-white mb-4">
                      <input 
                        type="password" 
                        id="typePasswordX" 
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label className="form-label" htmlFor="typePasswordX">Password</label>
                    </div>

                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}

                    
                    <button  className="border-1 rounded btn-outline-light btn-lg px-5 py-2 test accentb" type="submit">
                      LogIn
                    </button>
                    
                  </form>
                </div>
                
                <div>
                  <p className="mb-0">Don't have an account? <a href="/Signup" className="fw-bold accentT">Sign Up</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
  );
}

export default Login;