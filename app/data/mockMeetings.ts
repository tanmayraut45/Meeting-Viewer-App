import { Meeting } from '../types/meeting';

// Helper to create ISO date strings
const now = new Date('2025-11-21T02:54:00+05:30');

// 5 Upcoming meetings
export const upcomingMeetings: Meeting[] = [
    {
        id: '1',
        title: 'Product Roadmap Review',
        startTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        endTime: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        attendees: ['Sarah Chen', 'Michael Ross', 'Emily Davis'],
        description: 'Quarterly review of product roadmap and feature prioritization for Q1 2025.',
    },
    {
        id: '2',
        title: 'Engineering Standup',
        startTime: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        endTime: new Date(now.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        attendees: ['Alex Kumar', 'Lisa Park', 'James Wilson', 'Rachel Green'],
        description: 'Daily standup to sync on sprint progress and blockers.',
    },
    {
        id: '3',
        title: 'Client Presentation - Katalyst Demo',
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        attendees: ['John Smith', 'Anna Lee', 'David Brown', 'Sophie Turner', 'Mark Johnson'],
    },
    {
        id: '4',
        title: 'Design System Workshop',
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        attendees: ['Emma Watson', 'Tom Hardy'],
        description: 'Workshop to align on design system components and tokens.',
    },
    {
        id: '5',
        title: 'Investor Update Call',
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
        endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        attendees: ['Robert Williams', 'Jessica Taylor'],
        description: 'Monthly update call with Series A investors covering metrics and milestones.',
    },
];

// 5 Past meetings
export const pastMeetings: Meeting[] = [
    {
        id: '6',
        title: 'Sprint Planning - Week 47',
        startTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        endTime: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        attendees: ['Alex Kumar', 'Lisa Park', 'James Wilson', 'Rachel Green', 'Chris Evans'],
        description: 'Sprint planning for calendar integration and AI features.',
    },
    {
        id: '7',
        title: 'User Research Synthesis',
        startTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        endTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        attendees: ['Emma Watson', 'Sophie Turner', 'Anna Lee'],
        description: 'Review of user interviews and key insights for product improvements.',
    },
    {
        id: '8',
        title: 'Security Audit Review',
        startTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        attendees: ['Michael Ross', 'David Brown', 'Tom Hardy'],
        description: 'Quarterly security audit findings and action items.',
    },
    {
        id: '9',
        title: 'All-Hands Company Meeting',
        startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        endTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
        attendees: ['Everyone'],
        description: 'Monthly all-hands covering company updates, wins, and upcoming initiatives.',
    },
    {
        id: '10',
        title: 'API Architecture Discussion',
        startTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        endTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        attendees: ['Alex Kumar', 'James Wilson', 'Mark Johnson'],
        description: 'Technical discussion on MCP integration architecture and OAuth flow.',
    },
];
