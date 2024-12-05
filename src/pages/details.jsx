import React, { useState, useEffect } from 'react';
import {
  Page,
  Navbar,
  Block,
} from 'framework7-react';

const Card = (props) => {
  return (
    <div style = {{marginBottom:"10%",display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
    <div >
    <div style ={{fontWeight:"650",color:" rgba(129, 125, 125, 0.717)"}}>{props.title1}</div>
    <div style = {{fontWeight:"bold",fontSize:"16px",color:" rgba(80,80,80 )" }}>{props.subTitle1}</div>
    </div>
    <div>
    <div style ={{fontWeight:"650",color:" rgba(129, 125, 125, 0.717)"}}>{props.title2}</div>
    <div style = {{fontWeight:"bold",fontSize:"16px",color:" rgba(80,80,80 )" }}>{props.subTitle2}</div>
    </div>

    </div>
  );
};






const DetailsPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());


const currentDate = new Date();
// Extract the year
const year = currentDate.getFullYear(); // e.g., 2024

// Extract the month (note: months are 0-indexed, so January is 0)
const month = currentDate.getMonth() + 1; // e.g., 9 (for September)

// Extract the day of the month
const day = currentDate.getDate(); // e.g., 4

// Extract the day of the week (0 is Sunday, 6 is Saturday)
const dayOfWeek = currentDate.getDay(); // e.g., 3 (for Wednesday)

// Extract the hours
const hours = currentDate.getHours(); // e.g., 14 (for 2 PM)

// Extract the minutes
const minutes = currentDate.getMinutes(); // e.g., 30

// Extract the seconds
const seconds = currentDate.getSeconds(); // e.g., 45
const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;



  useEffect(() => {
    // Function to update the time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // console.log(currentTime);
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // const formattedTime = currentTime.toLocaleTimeString();


  const details = [
    {
      id: '1',
      title1: 'Date',
      subTitle1: formattedDate,
         title2: 'Bus Code',
      subTitle2: 'YAB251'
    },
    {
      id: '2',
      title1: 'Departure address',
      subTitle1: (
        <>
          Unilag gate, Lagos <br /> Nigeria
        </>
      ),
         title2: 'Departure time',
      subTitle2: '6:00 AM'
    },
    {
      id: '3',
      title1: 'Arrival address',
      subTitle1: (
        <>
          Interswitch, Lagos <br /> Nigeria
        </>
      ),
         title2: 'Arival time',
      subTitle2: '--:-- --'
    },
    {
      id: '4',
      title1: 'Vehicle type',
      subTitle1: 'Toyota Coaster - Bus',
         title2: 'Plate number',
      subTitle2: 'KSF-547 JL'
    },
  ];

  return (
    <Page name="details">
      <Navbar title="Details" />
      <Block strong inset color ="green">
        <div>
          {details.map((detail) => (
            <Card key={detail.id}
             title1={detail.title1} 
             subTitle1={detail.subTitle1}
             title2={detail.title2} 
             subTitle2={detail.subTitle2}

              />
          ))}
        </div>
      </Block>
    </Page>
  );
};

export default DetailsPage;
