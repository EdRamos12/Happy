import React, { useEffect, useState } from 'react';
import mapMarkerImg from '../img/marker.svg';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/pages/orphanages-map.css';
import happyMapIcon from '../utils/mapIcon';
import api from '../services/api';

interface Orphanage {
	latitude: number;
	longitude: number;
	id: number;
	name: string;
}

export default function OrphanagesMap() {
	const [orphanages, setOrphanages] = useState<Orphanage[]>([]);
	useEffect(() => {
		api.get('orphanages').then(resp => {
			setOrphanages(resp.data);
		});
	}, []);

	return (
		<div id="page-map">
			<aside>
				<header>
					<img src={mapMarkerImg} alt="Happy" />

					<h2>Choose an orphanage on the map.</h2>
					<p>{'Many children are waiting for your visit! :)'}</p>
				</header>

				<footer>
					<strong>São Bernardo do Campo</strong>
					<span>São Paulo</span>
				</footer>
			</aside>
			
			<Link to="/orphanages/create" className="create-orphanage">
				<FiPlus size={32} color="#FFF" />
			</Link>
			
			<Map center={[-23.7104888,-46.5258909]} zoom={15} style={{
				width: '100%',
				height: '100%'
			}}>
				{/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
				<TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

				{orphanages.map((orphanage, index) => (
					<Marker key={index} icon={happyMapIcon} position={[orphanage.latitude, orphanage.longitude]}>

						<Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
							{orphanage.name}
							<Link to={"/orphanages/"+orphanage.id}>
								<FiArrowRight size={20} color="white" />
							</Link>
						</Popup>
					</Marker>
				))}
			</Map>
		</div>
	);
}