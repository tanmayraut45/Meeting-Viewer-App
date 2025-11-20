'use client';

import { useState } from 'react';
import { MeetingCardProps } from '../types/meeting';

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format date and time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    return { dateStr, timeStr };
  };

  // Calculate duration in minutes
  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  const startDateTime = formatDateTime(meeting.startTime);
  const endDateTime = formatDateTime(meeting.endTime);
  const duration = calculateDuration(meeting.startTime, meeting.endTime);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {meeting.title}
      </h3>

      {/* Time & Duration */}
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{startDateTime.dateStr}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{startDateTime.timeStr} - {endDateTime.timeStr}</span>
        </div>

        <div className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
          {duration}
        </div>
      </div>

      {/* Attendees */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-sm">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-gray-700 font-medium">{meeting.attendees.length} attendees</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {meeting.attendees.slice(0, 3).map((attendee, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-xs border border-gray-200"
            >
              {attendee}
            </span>
          ))}
          {meeting.attendees.length > 3 && (
            <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-xs border border-gray-200">
              +{meeting.attendees.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Description (collapsible) */}
      {meeting.description && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="font-medium">
              {isExpanded ? 'Hide details' : 'Show details'}
            </span>
          </button>
          
          {isExpanded && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {meeting.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
