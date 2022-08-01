import React, { useState } from 'react'
import { cardType } from '../../../../model/model'
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Form } from 'react-bootstrap';

const CardLocation = ({ realCardDetail }: { realCardDetail: cardType }) => {

    // const [center, setCenter] = useState({
    //     latitude: realCardDetail.cardLatitude,
    //     longitute: realCardDetail.cardLongitude
    // })

    // const position =  new google.maps.LatLng(-34, 151);

    const [centerMarker, setCenterMarker] = useState(false)

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyCuKwJ-rZ1RFll_Vtaff-uT8NxDbmodILY",
      });
    
      if (!isLoaded) return null;
    const center = {
        lat: -3.745,
        lng: -38.523
      };

      if (!isLoaded) return null;
      
    return (
        <Form style={{ width: "100%" }}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <GoogleMap
                    // onClick={handleClick}
                    center={center}
                    zoom={15}
                    mapContainerClassName="w-full h-[32rem]"
                >
                    {/* {centerMarker && <Marker position={position} />} */}
                </GoogleMap>
            </Form.Group>
        </Form>
    )
}

export default CardLocation