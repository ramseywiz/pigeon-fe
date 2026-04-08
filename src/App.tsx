import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login/page';
import { AppPage } from './pages/events/page';
import { ArchivePage } from './pages/archive/page';
import { AllCommunityModule } from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';
import { NotificationProvider } from './notifications/NotificationProvider';
import { NotificationContainer } from './notifications/NotificationContainer';

const modules = [AllCommunityModule];

function App() {
  return (
    <NotificationProvider>
      <AgGridProvider modules={modules}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/events" element={<AppPage />} />
          <Route path="/archive" element={<ArchivePage />} />
        </Routes>
        <NotificationContainer />
      </AgGridProvider>
    </NotificationProvider>
  );
}

export default App;
