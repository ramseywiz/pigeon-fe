import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { EventPageLayout } from '../../components/eventpagelayout/eventpagelayout';
import { Button } from '../../components/ui/button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchEvents, selectEvents, selectEventsLoading } from '../../store/eventSlice';
import { formStateFromDto, type EventFormState } from '../../components/eventform/eventform';
import styles from './page.module.css';

type Tab = 'reminder' | 'daily' | 'weekly';

const TABS: { id: Tab; label: string }[] = [
  { id: 'reminder', label: 'Reminder' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
];

const FIXED_HEADER: Record<Tab, string | null> = {
  reminder: null,
  daily: "# Hey coogs! Here's what's happening today!\n",
  weekly: '# CougarCS Roadmap: Upcoming Events!\n',
};

function formatTime(hhmm: string): string {
  if (!hhmm) return '–';
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '–';
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function buildReminderMarkdown(form: EventFormState): string {
  const lines: string[] = [];
  lines.push(`# ${form.eventName || 'Untitled Event'} starts in 30 minutes!`);
  if (form.description) {
    lines.push('');
    lines.push(form.description);
  }
  lines.push('');
  lines.push(`**When:** ${formatTime(form.startTime)} – ${formatTime(form.endTime)}`);
  lines.push(`**Where:** ${form.location || 'TBD'}`);
  if (form.food) lines.push('Food will be provided!');
  lines.push('');
  lines.push("We'll see you guys there!");
  return lines.join('\n');
}

function buildDailyMarkdown(form: EventFormState): string {
  const lines: string[] = [];
  lines.push(`## ${form.eventName || 'Untitled Event'}`);
  if (form.description) {
    lines.push('');
    lines.push(form.description);
  }
  lines.push('');
  lines.push(`**When:** ${formatTime(form.startTime)} – ${formatTime(form.endTime)}`);
  lines.push(`**Where:** ${form.location || 'TBD'}`);
  if (form.food) lines.push('Food will be provided!');
  return lines.join('\n');
}

function buildWeeklyMarkdown(form: EventFormState): string {
  const lines: string[] = [];
  lines.push(`## ${form.eventName || 'Untitled Event'}`);
  if (form.description) {
    lines.push('');
    lines.push(form.description);
  }
  lines.push('');
  lines.push(`**Date:** ${formatDate(form.startDate)}`);
  lines.push(`**When:** ${formatTime(form.startTime)} – ${formatTime(form.endTime)}`);
  lines.push(`**Where:** ${form.location || 'TBD'}`);
  return lines.join('\n');
}

export const PreviewAnnouncementPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const events = useAppSelector(selectEvents);
  const loading = useAppSelector(selectEventsLoading);
  const event = id ? (events.find((e) => e.id === id) ?? null) : null;

  const [activeTab, setActiveTab] = useState<Tab>('reminder');
  const [reminderMd, setReminderMd] = useState('');
  const [dailyMd, setDailyMd] = useState('');
  const [weeklyMd, setWeeklyMd] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    if (events.length === 0) dispatch(fetchEvents());
  }, [events.length, dispatch]);

  useEffect(() => {
    if (!event) return;
    const form = formStateFromDto(event);
    if (form.image) {
      const url = URL.createObjectURL(form.image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setImageUrl(form.imageUrl ?? null);
  }, [event?.id]);

  useEffect(() => {
    if (event && !initialised) {
      const form = formStateFromDto(event);
      setReminderMd(buildReminderMarkdown(form));
      setDailyMd(buildDailyMarkdown(form));
      setWeeklyMd(buildWeeklyMarkdown(form));
      setInitialised(true);
    }
  }, [event, initialised]);

  const currentMd =
    activeTab === 'reminder' ? reminderMd : activeTab === 'daily' ? dailyMd : weeklyMd;

  const setCurrentMd = (value: string) => {
    if (activeTab === 'reminder') setReminderMd(value);
    else if (activeTab === 'daily') setDailyMd(value);
    else setWeeklyMd(value);
  };

  const fixedHeader = FIXED_HEADER[activeTab];

  const actions = (
    <Button variant="ghost" onClick={() => navigate(`/events/${id}`)}>
      ← Back to Event
    </Button>
  );

  if (loading && !event) {
    return <p className={styles.status}>Loading…</p>;
  }

  if (!loading && events.length > 0 && !event) {
    return <p className={styles.status}>Event not found.</p>;
  }

  return (
    <EventPageLayout title="Draft Announcement" actions={actions}>
      <div className={styles.tabStrip}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.split}>
        <div className={styles.editorPane}>
          <textarea
            className={styles.textarea}
            value={currentMd}
            onChange={(e) => setCurrentMd(e.target.value)}
            spellCheck={false}
            placeholder="Write your announcement in markdown…"
          />
        </div>
        <div className={styles.divider} />
        <div className={styles.previewPane}>
          <div className={styles.previewScroll}>
            <div className={styles.previewContent}>
              {fixedHeader && <Markdown remarkPlugins={[remarkBreaks]}>{fixedHeader}</Markdown>}
              <Markdown remarkPlugins={[remarkBreaks]}>{currentMd}</Markdown>
              {imageUrl && <img src={imageUrl} alt="Event flyer" className={styles.flyerImg} />}
            </div>
          </div>
        </div>
      </div>
    </EventPageLayout>
  );
};
