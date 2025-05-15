import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [timezones, setTimezones] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [localTime, setLocalTime] = useState(new Date());

  // Fetch available timezones from the backend on mount
  useEffect(() => {
    // axios.get('https://localhost:7005/api/time/timezones')
    axios.get('https://datetime.runasp.net/api/time/timezones')
      .then(response => {
        setTimezones(response.data);
        setSelectedTimezone(response.data[0]); // auto-select first timezone
      })
      .catch(error => console.error("Failed to load timezones", error));
  }, []);

  // Update local time every second
  useEffect(() => {
    const localTimer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(localTimer);  // Cleanup on component destroy
  }, []);

  // Update selected timezone's time every second
  useEffect(() => {
    if (!selectedTimezone) return;

    const fetchTime = () => {
      axios.get(`https://datetime.runasp.net/api/time`, {
        params: { timezone: selectedTimezone }
      })
      .then(response => setSelectedTime(response.data.selectedTime))
      .catch(error => console.error("Failed to fetch timezone time", error));
    };

    fetchTime(); // initial fetch
    const interval = setInterval(fetchTime, 1000);

    return () => clearInterval(interval);
  }, [selectedTimezone]);

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px' }}>
      <h2>🕒 Local Time (Your System):</h2>
      <h3>{localTime.toLocaleString()}</h3>

      <hr />

      <h2>🌍 Select Timezone:</h2>
      <select
        value={selectedTimezone}
        onChange={(e) => setSelectedTimezone(e.target.value)}
        style={{ padding: '8px', fontSize: '16px' }}
      >
        {timezones.map((tz) => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </select>

      <h3>Selected Time ({selectedTimezone}):</h3>
      <p style={{ fontSize: '18px' }}>{selectedTime}</p>
    </div>
  );
}

export default App;
