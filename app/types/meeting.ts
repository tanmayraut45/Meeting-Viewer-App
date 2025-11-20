export interface Attendee {
    displayName: string;
    email?: string;
}

export interface Meeting {
    id: string;
    title: string;
    start: string; // ISO 8601 format
    end: string;   // ISO 8601 format
    attendees: Attendee[];
    description?: string;
}

export interface MeetingCardProps {
    meeting: Meeting;
}
