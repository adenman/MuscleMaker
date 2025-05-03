import  { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // Import interaction plugin
import { Typography } from '@mui/material';
import { useParams } from "react-router-dom";
import { GET_USER_BY_ID } from "../utils/queries";
import { useQuery } from "@apollo/client";

function Cal() {
  const { userId } = useParams();
  const { loading, data } = useQuery(GET_USER_BY_ID, {
    variables: { userId: userId },
  });

  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    // Function to convert custom date format to ISO string
    const convertToISODate = (dateString) => {
      try {
        // Parse the date string
        const parsedDate = new Date(dateString);
        
        // Convert to ISO string
        return parsedDate.toISOString();
      } catch (error) {
        console.error('Date parsing error:', error);
        return null;
      }
    };

    // If you're getting dates from completed regiments
    if (data?.oneUser?.completedRegiments) {
      const userEvents = data.oneUser.completedRegiments.map(regiment => ({
        title: regiment.name,
        start: convertToISODate(regiment.date), // Convert date here
        allDay: false // Set to false if you want to show specific time
      })).filter(event => event.start !== null); // Remove events with invalid dates

      setCalendarEvents(userEvents);
    }
  }, [data]);

  function renderEventContent(eventInfo) {
    return (
      <div style={{ 
        pointerEvents: 'none',
        overflow: 'hidden', 
        backgroundColor: 'blue', 
        color: 'white', 
        padding: '2px' 
      }}>
        <Typography variant="body2"  component="span"  style={{ 
          textDecoration: 'none',
          color: 'inherit'
        }}>
          {eventInfo.event.title}
        </Typography>
      </div>
    );
  }

  // Debug logging
  

  return (
    <div className="App">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '' // You can add custom views here
        }}
        events={calendarEvents}
        eventContent={renderEventContent}
        height="auto"
        contentHeight="auto"
        aspectRatio={1.35}
        displayEventTime={true}
      />
    </div>
  );
}

export default Cal;