import React, { useState } from 'react'
import { cardType } from '../../../../model/model'
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Form } from 'react-bootstrap';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase/config';

const CardLocation = ({ realCardDetail }) => {

    const [center, setCenter] = useState({ lat: realCardDetail.cardLatitude, lng: realCardDetail.cardLongitude });
    const [centerMarker, setCenterMarker] = useState(false)

    const {isLoaded} = useLoadScript({googleMapApiKey: "AIzaSyBFdnSoRG8k4SbyrSmQyb8I3mUYdbRO3Bo"})

      if (!isLoaded) return (<div> Get maps data...</div>);
      const containerStyle = {
        width: '100%',
        height: '400px'
      };

      console.log(realCardDetail)

      const handleClick = async (e) => {
        setCenterMarker({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          await updateDoc(doc(db, "CardCollection", realCardDetail.cardId), {
            cardLatitude  : e.latLng.lat(),
            cardLongitude : e.latLng.lng(),
          });
      };

    return (
        <Form style={{ width: "100%" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label htmlFor='disableSelect'> Card Location</Form.Label>
                <GoogleMap
                    onClick={(e) => handleClick(e)}
                    center={center}
                    zoom={15}
                    mapContainerStyle={containerStyle}

                >
                    {centerMarker && <Marker position={centerMarker} />}
                </GoogleMap>
            </Form.Group>
        </Form>
    )
}

export default CardLocation