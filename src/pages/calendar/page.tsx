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
    events: [],
    weekOptions: {
      gridHeight: 500,
    },
    dayBoundaries: {
      start: '07:00',
      end: '22:00',
    },
  });

  useEffect(() => {
    if (allEvents.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch]);

  useEffect(() => {
    const calendarEvents = allEvents
      .filter((e) => !e.archived)
      .map((e) => ({
        id: e.id,
        title: e.eventName,
        start: toZonedDateTime(e.startDate, e.startTime),
        end: toZonedDateTime(e.endDate, e.endTime),
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
