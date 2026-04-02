import './page.css';

export const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-right">
        <div className="login-card">
          <h1>Enter Pigeon</h1>

          <button className="google-btn">Continue with Google</button>
        </div>
      </div>

      <div className="login-left">
        <h1>Welcome Back</h1>
        <p>CougarCS Portal</p>
      </div>
    </div>
  );
};
