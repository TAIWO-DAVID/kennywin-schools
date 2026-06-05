// app/api/calendar/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const calendarId = process.env.SCHOOL_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_API_KEY;

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&singleEvents=true&orderBy=startTime&timeMin=${new Date().toISOString()}`
  );

  if (!res.ok) return NextResponse.json([]);

  const data = await res.json();
  const events = data.items.map((e: any) => ({
    id: e.id,
    summary: e.summary,
    start: e.start.dateTime || e.start.date,
    location: e.location,
  }));

  return NextResponse.json(events);
}
