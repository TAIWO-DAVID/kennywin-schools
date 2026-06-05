"use client"

import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { CalendarDays, List, MapPin, Clock, X } from "lucide-react"

type EventItem = {
  id: string
  summary: string
  start: string
  location?: string
}

export default function AcademicCalendarPage() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showEventModal, setShowEventModal] = useState(false)

  const getEventType = (summary: string) => {
    const lower = summary.toLowerCase()
    if (lower.includes("term begins") || lower.includes("term ends")) return "term"
    if (lower.includes("break") || lower.includes("holiday")) return "holiday"
    if (lower.includes("exam")) return "exam"
    return "event"
  }

  const getEventStyles = (eventType: string) => {
    switch (eventType) {
      case "term":
        return "border-l-amber-500 bg-gradient-to-r from-amber-50 to-white"
      case "holiday":
        return "border-l-slate-400 bg-gradient-to-r from-slate-50 to-white"
      case "exam":
        return "border-l-amber-600 bg-gradient-to-r from-amber-100 to-white"
      default:
        return "border-l-slate-300 bg-white"
    }
  }

  const getTermDateRanges = () => {
    const currentYear = new Date().getFullYear()
    return {
      "First Term": {
        start: new Date(currentYear, 8, 1), // September 1st
        end: new Date(currentYear, 11, 31), // December 31st
      },
      "Second Term": {
        start: new Date(currentYear + 1, 0, 1), // January 1st
        end: new Date(currentYear + 1, 3, 30), // April 30th
      },
      "Third Term": {
        start: new Date(currentYear + 1, 3, 1), // April 1st (overlapping for flexibility)
        end: new Date(currentYear + 1, 6, 31), // July 31st
      },
    }
  }

  const getEventsForTerm = (termName: string) => {
    const termRanges = getTermDateRanges()
    const termRange = termRanges[termName as keyof typeof termRanges]

    if (!termRange) return []

    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate >= termRange.start && eventDate <= termRange.end
    })
  }

  const getOtherEvents = () => {
    const termRanges = getTermDateRanges()

    return events.filter((event) => {
      const eventDate = new Date(event.start)

      // Check if event falls within any term range
      const isInAnyTerm = Object.values(termRanges).some((range) => eventDate >= range.start && eventDate <= range.end)

      return !isInAnyTerm
    })
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  const handleDateClick = (date: Date) => {
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length > 0) {
      setSelectedDate(date)
      setShowEventModal(true)
    }
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/calendar")
        const data = await res.json()
        setEvents(data)
      } catch (error) {
        console.error("Failed to fetch events:", error)
        setEvents([
          {
            id: "1",
            summary: "First Term Begins",
            start: "2024-09-02T08:00:00Z",
            location: "Main Campus",
          },
          {
            id: "2",
            summary: "Parent-Teacher Conference",
            start: "2024-09-15T14:00:00Z",
            location: "School Hall",
          },
          {
            id: "3",
            summary: "Sports Day",
            start: "2024-10-05T09:00:00Z",
            location: "Sports Ground",
          },
          {
            id: "4",
            summary: "Mid-term Break",
            start: "2024-10-21T00:00:00Z",
          },
          {
            id: "5",
            summary: "Science Fair",
            start: "2024-11-12T10:00:00Z",
            location: "Science Lab",
          },
          {
            id: "6",
            summary: "First Term Ends",
            start: "2024-12-13T17:00:00Z",
          },
          {
            id: "7",
            summary: "Second Term Begins",
            start: "2025-01-06T08:00:00Z",
            location: "Main Campus",
          },
          {
            id: "8",
            summary: "Inter-House Competition",
            start: "2025-02-14T09:00:00Z",
            location: "School Grounds",
          },
          {
            id: "9",
            summary: "Career Day",
            start: "2025-03-10T10:00:00Z",
            location: "Assembly Hall",
          },
          {
            id: "10",
            summary: "Easter Break",
            start: "2025-03-24T00:00:00Z",
          },
          {
            id: "11",
            summary: "Second Term Ends",
            start: "2025-04-04T17:00:00Z",
          },
          {
            id: "12",
            summary: "Third Term Begins",
            start: "2025-04-21T08:00:00Z",
            location: "Main Campus",
          },
          {
            id: "13",
            summary: "Art Exhibition",
            start: "2025-05-15T11:00:00Z",
            location: "Art Studio",
          },
          {
            id: "14",
            summary: "Final Examinations",
            start: "2025-06-16T09:00:00Z",
            location: "Examination Hall",
          },
          {
            id: "15",
            summary: "Graduation Ceremony",
            start: "2025-07-05T15:00:00Z",
            location: "Main Hall",
          },
          {
            id: "16",
            summary: "Third Term Ends",
            start: "2025-07-11T17:00:00Z",
          },
          {
            id: "17",
            summary: "Summer Workshop",
            start: "2025-08-15T09:00:00Z",
            location: "Workshop Room",
          },
        ])
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium text-sm sm:text-base">Loading academic calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .react-calendar {
            width: 100%;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 0.75rem;
            font-family: inherit;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
          }
          .react-calendar__navigation {
            background: linear-gradient(to right, #fffbeb, #fef3c7);
            border-bottom: 1px solid #e2e8f0;
            border-radius: 0.75rem 0.75rem 0 0;
            padding: 0.75rem;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .react-calendar__navigation button {
            color: #92400e;
            font-weight: 700;
            font-size: 0.9rem;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            min-width: 2.5rem;
          }
          @media (min-width: 640px) {
            .react-calendar__navigation {
              padding: 1rem;
            }
            .react-calendar__navigation button {
              font-size: 1.1rem;
              padding: 0.5rem 1rem;
            }
          }
          .react-calendar__navigation button:hover {
            background-color: #f59e0b;
            color: white;
            transform: translateY(-1px);
          }
          .react-calendar__month-view__weekdays {
            background: #f8fafc;
            font-weight: 700;
            color: #475569;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
          }
          @media (min-width: 640px) {
            .react-calendar__month-view__weekdays {
              padding: 1rem 0;
            }
          }
          .react-calendar__month-view__weekdays__weekday {
            text-align: center;
            text-transform: uppercase;
            font-size: 0.75rem;
            letter-spacing: 0.05em;
          }
          @media (min-width: 640px) {
            .react-calendar__month-view__weekdays__weekday {
              font-size: 0.875rem;
            }
          }
          .react-calendar__tile {
            background: white;
            border: none;
            color: #475569;
            font-weight: 500;
            padding: 1rem 0.25rem;
            position: relative;
            transition: all 0.2s;
            cursor: pointer;
            min-height: 3rem;
          }
          @media (min-width: 640px) {
            .react-calendar__tile {
              padding: 1.5rem 0.5rem;
              min-height: 4rem;
            }
          }
          .react-calendar__tile:hover {
            background-color: #fef3c7;
            color: #92400e;
            transform: translateY(-1px);
          }
          .react-calendar__tile--active {
            background: linear-gradient(135deg, #f59e0b, #d97706) !important;
            color: white !important;
            font-weight: 700 !important;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
          .react-calendar__tile--now {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: white;
            font-weight: 600;
            box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
          }
          .react-calendar__tile--hasEvents {
            background: linear-gradient(to bottom, white, #fffbeb);
          }
          .event-indicator {
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1px;
            flex-wrap: wrap;
            justify-content: center;
            max-width: 90%;
          }
          @media (min-width: 640px) {
            .event-indicator {
              bottom: 4px;
              gap: 2px;
            }
          }
          .event-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #f59e0b;
            box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
          }
          @media (min-width: 640px) {
            .event-dot {
              width: 6px;
              height: 6px;
            }
          }
          .event-dot.term { background: #f59e0b; }
          .event-dot.holiday { background: #64748b; }
          .event-dot.exam { background: #dc2626; }
        `,
        }}
      />

      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Academic Calendar</h1>
              <p className="text-sm sm:text-base text-slate-600">View important dates, terms, and school events</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:bg-white sm:border-2 sm:border-slate-200 sm:rounded-xl sm:p-2 sm:shadow-sm sm:self-center lg:self-end">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-700 hover:text-amber-600 hover:bg-amber-50 bg-white border border-slate-200 sm:border-0"
                }`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
                List View
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  viewMode === "calendar"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-700 hover:text-amber-600 hover:bg-amber-50 bg-white border border-slate-200 sm:border-0"
                }`}
              >
                <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5" />
                Calendar View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-slate-600">
          <span className="hidden sm:inline">Current view:</span>
          <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
            {viewMode === "list" ? "📋 List View" : "📅 Calendar View"}
          </span>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        {viewMode === "list" ? (
          <div className="space-y-4 sm:space-y-6">
            {["First Term", "Second Term", "Third Term"].map((term) => {
              const termEvents = getEventsForTerm(term)

              if (termEvents.length === 0) return null

              const termRanges = getTermDateRanges()
              const termRange = termRanges[term as keyof typeof termRanges]

              return (
                <div key={term} className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-1 h-6 sm:h-8 bg-amber-500 rounded-full"></div>
                      {term}
                    </h2>
                    <div className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-0">
                      {termRange.start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                      {termRange.end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {termEvents.map((event) => {
                      const date = new Date(event.start).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      const eventType = getEventType(event.summary)

                      return (
                        <div
                          key={event.id}
                          className={`p-4 sm:p-6 rounded-lg shadow-sm border-l-4 ${getEventStyles(eventType)} hover:shadow-md transition-shadow`}
                        >
                          <div className="flex flex-col gap-3 sm:gap-2">
                            <div className="flex-1">
                              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">
                                {event.summary}
                              </h3>
                              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span className="break-words">{date}</span>
                                </div>
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    <span className="break-words">{event.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex justify-start sm:justify-end">
                              <span className="inline-block px-2 sm:px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {getOtherEvents().length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-1 h-6 sm:h-8 bg-slate-400 rounded-full"></div>
                  Other Events
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {getOtherEvents().map((event) => {
                    const date = new Date(event.start).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    const eventType = getEventType(event.summary)

                    return (
                      <div
                        key={event.id}
                        className={`p-4 sm:p-6 rounded-lg shadow-sm border-l-4 ${getEventStyles(eventType)} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex flex-col gap-3 sm:gap-2">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">{event.summary}</h3>
                            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span className="break-words">{date}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span className="break-words">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-start sm:justify-end">
                            <span className="inline-block px-2 sm:px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                              {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
            <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs sm:text-sm text-amber-800 font-medium text-center sm:text-left">
                💡 Tap dates with events (marked with dots) to view details
              </p>
            </div>

            <Calendar
              onClickDay={handleDateClick}
              tileContent={({ date, view }) => {
                const dayEvents = getEventsForDate(date)

                if (dayEvents.length > 0) {
                  return (
                    <div className="event-indicator">
                      {dayEvents.slice(0, 3).map((event, index) => {
                        const eventType = getEventType(event.summary)
                        return <div key={index} className={`event-dot ${eventType}`} title={event.summary} />
                      })}
                      {dayEvents.length > 3 && <div className="event-dot" style={{ background: "#6b7280" }} />}
                    </div>
                  )
                }
                return null
              }}
              tileClassName={({ date, view }) => {
                const dayEvents = getEventsForDate(date)
                return dayEvents.length > 0 ? "react-calendar__tile--hasEvents" : ""
              }}
            />
          </div>
        )}

        {showEventModal && selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 pr-2">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => {
                    const eventType = getEventType(event.summary)
                    const time = new Date(event.start).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })

                    return (
                      <div key={event.id} className={`p-3 sm:p-4 rounded-lg border-l-4 ${getEventStyles(eventType)}`}>
                        <h4 className="font-semibold text-slate-800 mb-2 text-sm sm:text-base">{event.summary}</h4>
                        <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            {time}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="break-words">{event.location}</span>
                            </div>
                          )}
                        </div>
                        <span className="inline-block mt-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                          {eventType.charAt(0).toUpperCase() + eventType.slice(1)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
