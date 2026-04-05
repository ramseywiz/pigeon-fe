import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login/page';
import { AppPage } from './pages/app/page';
import { ArchivePage } from './pages/archive/page';
import { AllCommunityModule } from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';

const modules = [AllCommunityModule];

function App() {
  return (
    <AgGridProvider modules={modules}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/app/archive" element={<ArchivePage />} />
      </Routes>
    </AgGridProvider>
  );
}

export default App;
