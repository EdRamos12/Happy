import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus } from "react-icons/fi";
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import happyMapIcon from "../utils/mapIcon";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import { useHistory } from "react-router-dom";

export default function CreateOrphanage() {
  const history = useHistory();

  const [latLng, setLatLng] = useState({ latitude: 0, longitude: 0 });
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  function handleMapClick(event: LeafletMouseEvent) {
    const {lat, lng} = event.latlng;
    setLatLng({
      latitude: lat,
      longitude: lng
    })
  }

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    const images = Array.from(event.target.files);
    setImages(images);
    const preview = images.map(image => {
      return URL.createObjectURL(image);
    })
    setPreviewImages(preview);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const { latitude, longitude } = latLng;

    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', String(openOnWeekends));
    console.log(images);
    images.forEach(image => {
      data.append('images', image);
    });
    
    await api.post('orphanages', data);

    alert('Orphanage registered successfully!');
    history.push('/map');
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Data</legend>

            <Map 
              center={[-23.7104888,-46.5258909]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {latLng.latitude !== 0 && (
                <Marker interactive={false} icon={happyMapIcon} position={[latLng.latitude, latLng.longitude]} />
              )}
              
            </Map>

            <div className="input-block">
              <label htmlFor="name">Name</label>
              <input onChange={event => setName(event.target.value)} required id="name" />
            </div>

            <div className="input-block">
              <label htmlFor="about">About <span>Max. 300 characters</span></label>
              <textarea onChange={event => setAbout(event.target.value)} required id="name" maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Photos</label>

              <div className="uploaded-image">
                {previewImages.map((image, index) => (
                  <div key={index} className="preview">
                    <img src={image} alt={name} />
                    <span onClick={() => {
                      images.splice(index, 1)
                      const preview = images.map(image => {
                        return URL.createObjectURL(image);
                      });
                      setPreviewImages(preview);
                    }}>X</span>
                  </div>
                ))}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitation</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instructions</label>
              <textarea onChange={event => setInstructions(event.target.value)} required id="instructions" />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Opening hours</label>
              <input onChange={event => setOpeningHours(event.target.value)} required id="opening_hours" />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Attends on weekends</label>

              <div className="button-select">
                <button type="button" onClick={() => {setOpenOnWeekends(true)}} className={String(openOnWeekends && "active")}>Yes</button>
                <button type="button" onClick={() => {setOpenOnWeekends(false)}} className={String(!openOnWeekends && "active")}>No</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Submit!
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
