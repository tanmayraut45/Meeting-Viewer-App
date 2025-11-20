import MeetingCard from './components/MeetingCard';
import { upcomingMeetings, pastMeetings } from './data/mockMeetings';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Meeting Viewer</h1>
          <p className="mt-1 text-sm text-gray-600">
            View and manage your calendar meetings
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Upcoming Meetings Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Upcoming Meetings
              </h2>
              <p className="text-sm text-gray-600">
                {upcomingMeetings.length} meetings scheduled
              </p>
            </div>
            
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </section>

          {/* Past Meetings Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Past Meetings
              </h2>
              <p className="text-sm text-gray-600">
                {pastMeetings.length} recent meetings
              </p>
            </div>
            
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
