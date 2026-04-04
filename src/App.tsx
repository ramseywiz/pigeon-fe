import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login/page';
import { AppPage } from './pages/app/page';
import { ArchivePage } from './pages/archive/page';
import { AddPage } from './pages/add/page';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/app/add" element={<AddPage />} />
        <Route path="/app/archive" element={<ArchivePage />} />
      </Routes>
    </>
  );
}

export default App;
