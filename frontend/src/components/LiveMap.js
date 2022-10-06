import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import CarMarker from "./CarMarker";

import {
      ApolloClient,
      InMemoryCache,
      gql,
    } from '@apollo/client';
    
const apiUrl = `https://${process.env.REACT_APP_ASTRA_DB_ID}-${process.env.REACT_APP_ASTRA_DB_REGION}.apps.astra.datastax.com/api/graphql/${process.env.REACT_APP_ASTRA_DB_KEYSPACE}`;

const client = new ApolloClient({
      uri: apiUrl,
      fetchOptions: {
        mode: 'no-cors',
      },
      cache: new InMemoryCache(),
      headers: {
        'x-cassandra-token':
        process.env.REACT_APP_ASTRA_DB_APPLICATION_TOKEN,
      },
    })

const GET_CURRENT_POSITION = gql`
	query getLatestLatLong($org: String, $lastTS: Timestamp) {
		telemetry_latest(
			options: { pageSize: 100 }
			filter: { organization_id: { eq: $org }, key: { eq: "latlong" }, ts: { gt: $lastTS } }
		) {
			values {
				lat: value
				long: value2
				device_id
				ts
			}
		}
	}
`;


export function LiveMap() {
      console.log(apiUrl);

  //  
  const [currentTrack, setCurrentTrack] = useState([{ lat:  20.7021094, lng: -103.375984 }]);
  
  useEffect(() => {
    //setCurrentTrack(dataStory[cursor]);
    const interval = setInterval(() => {
      const fetchBusinesses =  () => {
            console.log("Executed");
            return client.query({
              query:GET_CURRENT_POSITION
            })
         .then(rcvdBusinesses => {
            console.log("data loaded : ", rcvdBusinesses.data.telemetry_latest);

           if (rcvdBusinesses.data && rcvdBusinesses.data.telemetry_latest) {
            console.log("data loaded : ", rcvdBusinesses.data.telemetry_latest);
      
            let device_id = "";
            
            let tmp = []
            rcvdBusinesses.data.telemetry_latest.values.forEach((device) => {
              
              console.log("device_id:" + device.device_id);
              const long = parseFloat(device.long);
              console.log("long:" + long);
              const lat = parseFloat(device.lat);
              console.log("lat:" + lat);
      
              if (device.device_id !== device_id) {
               tmp.push({ lat: lat, lng: long });
                device_id = device.device_id;
                console.log("current track",currentTrack);
    
              }
            });
            setCurrentTrack(tmp);
          }
         })
         .catch(err => {
           // error handling
           console.log(err)
         });
      }; 
       fetchBusinesses();  
     }, 1000);
     return () => {
       clearInterval(interval);
     };


  }, []);

  return (
    <div>
      <MapContainer
        style={{ height: "calc(100vh - 52px)" }}
        center={[20.7021094, -103.375984]}
        zoom={17}
        minZoom={5}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
        currentTrack.map((item, i) => { return (
				 <CarMarker key={i} data={{ lat: item.lat, lng: item.lng } ?? {}} />
			  )})
      }
      </MapContainer>
    </div>
  );
}

