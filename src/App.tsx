import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/login/page';
import { AppPage } from './pages/events/page';
import { ArchivePage } from './pages/archive/page';
import { CalendarPage } from './pages/calendar/page';
import { EventFormPage } from './pages/eventform/page';
import { AllCommunityModule } from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';
import { NotificationProvider } from './notifications/NotificationProvider';
import { NotificationContainer } from './notifications/NotificationContainer';
import { ProtectedLayout } from './components/protectedlayout/ProtectedLayout';

const modules = [AllCommunityModule];

function App() {
  return (
    <NotificationProvider>
      <AgGridProvider modules={modules}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/events" element={<AppPage />} />
            <Route path="/events/new" element={<EventFormPage />} />
            <Route path="/events/:id" element={<EventFormPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Routes>
        <NotificationContainer />
      </AgGridProvider>
    </NotificationProvider>
  );
}

export default App;
