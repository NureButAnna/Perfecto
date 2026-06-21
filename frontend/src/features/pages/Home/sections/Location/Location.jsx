import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import btn from '../../../../../styles/buttons.module.css';
import s   from './Location.module.css';

const BASE_URL = "http://127.0.0.1:8000";

const MAP_OPTIONS = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [
    { featureType: 'poi',             elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit.station', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  ],
};

const MARKER_ICON = {
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  fillColor: '#EC407A',
  fillOpacity: 1,
  strokeColor: '#fff',
  strokeWeight: 1.5,
  scale: 1.8,
  anchor: { x: 12, y: 24 },
};

export default function Location() {
  const [branches,  setBranches]  = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city,      setCity]      = useState('Всі міста');
  const [selected,  setSelected]  = useState(null);
  const [map,       setMap]       = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/dry_cleaners/`)
      .then(res => res.json())
      .then(data => setBranches(data))
      .finally(() => setIsLoading(false));
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const cities   = ['Всі міста', ...new Set(branches.map(b => b.city))];
  const filtered = city === 'Всі міста'
    ? branches
    : branches.filter(b => b.city === city);

  const handleMapLoad     = useCallback((m) => setMap(m), []);
  const handleMarkerClick = useCallback((branch) => {
    setSelected(branch);
    map?.panTo({ lat: Number(branch.latitude), lng: Number(branch.longitude) });
  }, [map]);
  const handleBranchClick = useCallback((branch) => {
    setSelected(branch);
    map?.panTo({ lat: Number(branch.latitude), lng: Number(branch.longitude) });
    map?.setZoom(15);
  }, [map]);

  const center = filtered.length === 1
    ? { lat: Number(filtered[0].latitude), lng: Number(filtered[0].longitude) }
    : { lat: 49.9935, lng: 36.2304 };

  const formatAddress = (b) =>
    [b.street, b.house_number].filter(Boolean).join(', ');

  return (
    <section id="location" className={s.location}>
      <div className={s.container}>
        <h2 className={s.title}>Де нас знайти?</h2>
        <p className={s.subtitle}>Обирай місто та переглядай доступні пункти</p>

        {isLoading ? (
          <p className={s.loading}>Завантаження філіалів…</p>
        ) : (
          <>
            <div className={s.controls}>
              <div className={s.cityTabs}>
                {cities.map(c => (
                  <button
                    key={c}
                    className={`${s.cityTab} ${city === c ? s.cityTabActive : ''}`}
                    onClick={() => { setCity(c); setSelected(null); }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.mapLayout}>
              <aside className={s.branchList}>
                {filtered.map(branch => (
                  <div
                    key={branch.id}
                    className={`${s.branchCard} ${selected?.id === branch.id ? s.branchCardActive : ''}`}
                    onClick={() => handleBranchClick(branch)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && handleBranchClick(branch)}
                  >
                    <div className={s.branchDot} aria-hidden="true" />
                    <div className={s.branchInfo}>
                      <div className={s.branchName}>Perfecto — {branch.city}</div>
                      <div className={s.branchAddress}>{formatAddress(branch)}</div>
                      <a
                        href={`tel:${branch.phone_number}`}
                        className={s.branchPhone}
                        onClick={e => e.stopPropagation()}
                      >
                        {branch.phone_number}
                      </a>
                    </div>
                  </div>
                ))}
              </aside>

              <div className={s.mapWrap}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerClassName={s.map}
                    center={center}
                    zoom={12}
                    options={MAP_OPTIONS}
                    onLoad={handleMapLoad}
                  >
                    {filtered.map(branch => (
                      <Marker
                        key={branch.id}
                        position={{ lat: Number(branch.latitude), lng: Number(branch.longitude) }}
                        icon={MARKER_ICON}
                        onClick={() => handleMarkerClick(branch)}
                        title={`Perfecto — ${branch.city}`}
                      />
                    ))}
                    {selected && (
                      <InfoWindow
                        position={{ lat: Number(selected.latitude), lng: Number(selected.longitude) }}
                        onCloseClick={() => setSelected(null)}
                      >
                        <div className={s.infoWindow}>
                          <strong className={s.infoName}>Perfecto — {selected.city}</strong>
                          <p className={s.infoAddress}>{formatAddress(selected)}</p>
                          <a href={`tel:${selected.phone_number}`} className={s.infoPhone}>
                            {selected.phone_number}
                          </a>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : (
                  <div className={s.mapLoading}>
                    <span>Завантаження карти...</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className={s.cta}>
        <div className={s.ctaInner}>
          <p className={s.ctaText}>
            Не знайшли відділення у Вашому місті?{' '}
            <strong>Надішліть речі Новою Поштою</strong>
          </p>
          <button className={btn.btnPrimary}>Оформити замовлення</button>
        </div>
      </div>
    </section>
  );
}