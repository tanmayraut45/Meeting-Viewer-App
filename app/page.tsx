'use client';

import useSWR from 'swr';
import MeetingCard from './components/MeetingCard';
import { Meeting } from './types/meeting';

interface EventsData {
  upcoming: Meeting[];
  past: Meeting[];
}

const fetcher = (url: string) => 
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Network error');
    return res.json();
  });

export default function Home() {
  const { data, error, mutate } = useSWR<EventsData>('/api/events', fetcher);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meeting Viewer</h1>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage your calendar meetings
                </p>
              </div>
              <a
                href="/api/oauth/start"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Connect Google Calendar
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-red-200 rounded-lg p-8 text-center">
            <svg 
              className="mx-auto h-12 w-12 text-red-500 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load events
            </h3>
            <p className="text-gray-600 mb-4">
              There was an error loading your meetings. Please try again.
            </p>
            <button
              onClick={() => mutate()}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Loading state
  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Meeting Viewer</h1>
                <p className="mt-1 text-sm text-gray-600">
                  View and manage your calendar meetings
                </p>
              </div>
              <a
                href="/api/oauth/start"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Connect Google Calendar
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Loading skeleton for both sections */}
            {[1, 2].map((section) => (
              <section key={section}>
                <div className="mb-6">
                  <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-32 animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="h-40 bg-white border border-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const { upcoming, past } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meeting Viewer</h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage your calendar meetings
              </p>
            </div>
            <a
              href="/api/oauth/start"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Connect Google Calendar
            </a>
          </div>
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
                {upcoming.length} meetings scheduled
              </p>
            </div>
            
            <div className="space-y-4">
              {upcoming.map((meeting) => (
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
                {past.length} recent meetings
              </p>
            </div>
            
            <div className="space-y-4">
              {past.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
