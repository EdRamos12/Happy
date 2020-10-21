import React, { useEffect, useState } from "react";
// import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import happyMapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useParams } from "react-router-dom";

interface Orphanage {
	latitude: number;
	longitude: number;
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: string;
  images: {
    url: string;
  }[];
}

interface RouteParams {
  id: string;
}

export default function Orphanage() {
  const [orphanage, setOrphanages] = useState<Orphanage>();
  const [activeImage, setActiveImage] = useState(0);
  const {id} = useParams<RouteParams>();
	useEffect(() => {
		api.get('orphanages/'+id).then(resp => {
			setOrphanages(resp.data);
		});
  }, [id]);

  if (!orphanage) {
    return <p>Loading...</p>
  }
  
  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImage].url} alt={orphanage.name} />

          <div className="images">
            
            {orphanage.images.map((image, index) => (
              <button onClick={() => {
                setActiveImage(index);
              }} key={index} className={String(activeImage === index && "active")} type="button">
                <img src={image.url} alt={orphanage.name} />
              </button>
            ))}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.about}</p>

            <div className="map-container">
              <Map 
                center={[orphanage.latitude, orphanage.longitude]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[orphanage.latitude, orphanage.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destionation=${orphanage.latitude},${orphanage.longitude}`}>See routes on Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Monday to Friday <br />
                {orphanage.opening_hours}
              </div>
              { orphanage.open_on_weekends ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                  We attend <br />
                  on weekends
                </div>
              ) : (
                <div className="open-on-weekends dont-open">
                  <FiInfo size={32} color="#FF669D" />
                  We don't attend <br />
                  on weekends
                </div>
              )}
            </div>

            {/* <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}