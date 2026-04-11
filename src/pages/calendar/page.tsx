import { useEffect, useState } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import { EventPageLayout } from '../../components/eventpagelayout/eventpagelayout';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEvents, selectEvents, selectEventsLoading } from '../../store/eventSlice';
import styles from './page.module.css';
import { Temporal } from 'temporal-polyfill';

const toZonedDateTime = (date: string, time: string): Temporal.ZonedDateTime => {
  const normalizedTime = time.length === 8 ? time : `${time}:00`;
  return Temporal.ZonedDateTime.from(`${date}T${normalizedTime}+00:00[UTC]`);
};

const BRANCH_CALENDARS = {
  Main: {
    colorName: 'branch-main',
    lightColors: { main: '#840B1F', container: 'rgba(200, 15, 46, 0.15)', onContainer: '#840B1F' },
  },
  InfoSec: {
    colorName: 'branch-infosec',
    lightColors: { main: '#0D74A0', container: 'rgba(0, 178, 255, 0.15)', onContainer: '#0D74A0' },
  },
  WebDev: {
    colorName: 'branch-webdev',
    lightColors: { main: '#3F2C8C', container: 'rgba(117, 84, 246, 0.15)', onContainer: '#3F2C8C' },
  },
  Tutoring: {
    colorName: 'branch-tutoring',
    lightColors: { main: '#0D743B', container: 'rgba(19, 206, 103, 0.15)', onContainer: '#0D743B' },
  },
  Archived: {
    colorName: 'branch-archived',
    lightColors: {
      main: '#888888',
      container: 'rgba(128, 128, 128, 0.15)',
      onContainer: '#666666',
    },
  },
};

export const CalendarPage = () => {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);

  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [createViewMonthGrid(), createViewWeek(), createViewMonthAgenda()],
    timezone: 'America/Chicago',
    defaultView: 'month-grid',
    plugins: [eventsService],
    calendars: BRANCH_CALENDARS,
    events: [],
    weekOptions: {
      gridHeight: 600,
    },
    dayBoundaries: {
      start: '10:00',
      end: '21:00',
    },
  });

  useEffect(() => {
    if (allEvents.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch]);

  useEffect(() => {
    const calendarEvents = allEvents.map((e) => ({
      id: e.id,
      title: e.eventName,
      start: toZonedDateTime(e.startDate, e.startTime),
      end: toZonedDateTime(e.endDate, e.endTime),
      calendarId: e.archived ? 'Archived' : e.branch,
    }));

    eventsService.set(calendarEvents);
  }, [allEvents, eventsService]);

  return (
    <EventPageLayout title="Calendar">
      <div className={styles.calendarWrapper}>
        {loading && allEvents.length === 0 ? (
          <p className={styles.loading}>Loading...</p>
        ) : (
          <ScheduleXCalendar calendarApp={calendar} />
        )}
      </div>
    </EventPageLayout>
  );
};
