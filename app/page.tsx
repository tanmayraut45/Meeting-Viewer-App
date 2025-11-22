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

  // Handle OAuth Popup Flow
  const startOAuthFlow = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      '/api/oauth/start',
      'Connect Google Calendar',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'OAUTH_SUCCESS') {
        mutate(); // Revalidate data
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  // Error state - check if it's a 401 (Unauthorized)
  const isUnauthorized = error && (error.message === 'Network error' || error.status === 401);

  if (error && !isUnauthorized) {
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
              <button
                onClick={startOAuthFlow}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Connect Google Calendar
              </button>
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

  // Loading state OR Unauthorized (show empty state with connect button)
  if (!data || isUnauthorized) {
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
              <button
                onClick={startOAuthFlow}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Connect Google Calendar
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isUnauthorized ? (
             <div className="text-center py-20">
                <div className="bg-white rounded-lg p-8 max-w-md mx-auto border border-gray-200 shadow-sm">
                    <svg className="w-16 h-16 mx-auto text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Calendar</h2>
                    <p className="text-gray-600 mb-6">
                        Connect your Google Calendar to view your upcoming and past meetings in one place.
                    </p>
                    <button
                        onClick={startOAuthFlow}
                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                             <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                             <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                             <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                </div>
             </div>
          ) : (
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
          )}
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
            <button
              onClick={startOAuthFlow}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Reconnect Calendar
            </button>
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
