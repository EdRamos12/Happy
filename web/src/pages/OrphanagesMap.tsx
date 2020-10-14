import React from 'react';
import mapMarkerImg from '../img/marker.svg';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/pages/orphanages-map.css';

export default function OrphanagesMap() {
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
			
			<Link to="/" className="create-orphanage">
				<FiPlus size={32} color="#FFF" />
			</Link>
			
			<Map center={[-23.7104888,-46.5258909]} zoom={15} style={{
				width: '100%',
				height: '100%'
			}}>
				{/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}
				<TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />
			</Map>
		</div>
	);
}