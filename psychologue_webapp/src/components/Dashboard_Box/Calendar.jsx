import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AppointmentsAPI from '../../services/AppointmentsAPI';
import moment from 'moment';
import PropTypes from 'prop-types';
import { AuthContext } from '../../context/AuthContext';
import { Box, Button, Text } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';


export function Calendar({clientId = null, addClient = false}) {

  const [events, setEvents] = useState([]);
  const { logout } = useContext(AuthContext);

  const highlightCurrentDay = ({ date, el }) => {
    if (moment().isSame(date, 'day')) {
      el.style.backgroundColor = 'rgba(75,192,192,0.15)'; // Change to your preferred color
    }
  };

  const fetchEvents = async () => {
    setEvents(await AppointmentsAPI.getAppointments(clientId));
  }
  useEffect(() => {
    fetchEvents();
  }, [])
  useEffect(() => {
    console.log(events)
  }, [events])

  // Define custom button and headerToolbar configuration here.
  const headerToolbar = {
    left: 'prev,next myCustomButton',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek',
  };

  const headerToolbarWithoutButton = {
    left: 'prev,next',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek',
  };
  
  const customButtons = {
    myCustomButton: {
      text: "+ Rendez-vous",
      click: function() {
        alert('clicked the custom button!');
      },
    },
  };

  const views = {
    timeGridWeek: {
        buttonText: 'Semaine',
    },
    dayGridMonth: {
        buttonText: 'Mois'
    }
  }

  // Event content renderer function.
  function renderEventContent(eventInfo) {
    return (
      <>
        <p><b>{eventInfo.timeText}</b> | <i>{eventInfo.event.title}</i></p>
      </>
    );
  }

  return (
    <Box as='div' display={'flex'} flexDirection={'column'} gap={"20px"}>
      <Box as='div' display={'flex'} justifyContent={'space-between'}>
        <Text fontSize={"24px"} fontWeight={600}>Mon calendrier</Text>
        {addClient ? null : <Button variant={'ghost'} onClick={logout}>Deconnexion</Button>}
      </Box>
      <FullCalendar
        // editable
        // eventDragStop={(data) => console.log(data.event._instance.range)}
        dayCellDidMount={highlightCurrentDay}
        allDaySlot={false}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        slotMinTime={"08:00:00"}
        slotMaxTime={"20:00:00"}
        slotDuration={"00:30:00"}
        initialView='timeGridWeek'
        eventDurationEditable={false}
        // weekends={false}
        hiddenDays={[0]}
        locale={'fr'}
        events={events}
        aspectRatio={2}
        eventContent={renderEventContent}
        views={views}
        customButtons={customButtons} // Apply custom buttons here.
        headerToolbar={addClient ? headerToolbar : headerToolbarWithoutButton} // Apply header toolbar configuration here.
        
      />
    </Box>
  );
}


Calendar.propTypes = {
  clientId: PropTypes.number,
}
