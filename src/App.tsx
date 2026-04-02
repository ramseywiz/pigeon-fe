import { Route, Routes } from 'react-router';
import { LoginPage } from './pages/login/page';
import { CallbackPage } from './pages/callback/page';
import { AppPage } from './pages/dash/page';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/app" element={<AppPage />} />
    </Routes>
  );
}

export default App;
