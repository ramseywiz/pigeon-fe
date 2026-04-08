import { EventPageLayout } from '../../components/eventpagelayout/eventpagelayout';
import { EventGrid } from '../../components/eventgrid/eventgrid';

export const ArchivePage = () => {
  return (
    <EventPageLayout title="Archive">
      <EventGrid readonly filterFn={(e) => e.archived} />
    </EventPageLayout>
  );
};
