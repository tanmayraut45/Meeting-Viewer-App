import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
    try {
        // Read the mock events JSON file
        const filePath = path.join(process.cwd(), 'mocks', 'events.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContents);

        // Optional: Simulate network delay for testing loading states
        await new Promise((resolve) => setTimeout(resolve, 300));

        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to read mock events:', error);
        return NextResponse.json(
            { error: 'Failed to load events' },
            { status: 500 }
        );
    }
}
