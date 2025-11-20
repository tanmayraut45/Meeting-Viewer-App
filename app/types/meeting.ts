export interface Meeting {
    id: string;
    title: string;
    startTime: string; // ISO 8601 format
    endTime: string;   // ISO 8601 format
    attendees: string[];
    description?: string;
}

export interface MeetingCardProps {
    meeting: Meeting;
}
