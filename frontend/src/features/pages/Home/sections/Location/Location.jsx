import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import NovaPoshtaModal from "../Location/NovaPoshta/NovaPoshtaModal";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { dryCleanersApi } from "../../../../../api/dryCleanersApi";
import btn from "../../../../../styles/buttons.module.css";
import s from "./Location.module.css";
import { useTranslation } from "react-i18next";

const MAP_OPTIONS = {
  disableDefaultUI: false, zoomControl: true, streetViewControl: false,
  mapTypeControl: false, fullscreenControl: false,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit.station", elementType: "labels", stylers: [{ visibility: "off" }] },
  ],
};
const MARKER_ICON = {
  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  fillColor: "#EC407A", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 1.5, scale: 1.8, anchor: { x: 12, y: 24 },
};
const UKRAINE_CENTER = { lat: 48.3794, lng: 31.1656 };

export default function Location() {
  const { t } = useTranslation();
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [city, setCity] = useState(t("location.allCities"));
  const [selected, setSelected] = useState(null);
  const [map, setMap] = useState(null);
  const { user, openLogin } = useAuth();
  const [isNovaPoshtaOpen, setIsNovaPoshtaOpen] = useState(false);

  useEffect(() => {
  dryCleanersApi
    .getAll()
    .then(data => setBranches(data))
    .finally(() => setIsLoading(false));
}, []);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });
  const allCitiesLabel = t("location.allCities");
  const cities = [allCitiesLabel, ...new Set(branches.map(b => b.city))];
  const filtered = city === allCitiesLabel ? branches : branches.filter(b => b.city === city);

  const handleMapLoad = useCallback(mapInstance => setMap(mapInstance), []);

  useEffect(() => {
    if (!map || filtered.length === 0 || !window.google) return;
    if (city === allCitiesLabel) { map.panTo(UKRAINE_CENTER); map.setZoom(6); return; }
    const bounds = new window.google.maps.LatLngBounds();
    filtered.forEach(branch => bounds.extend({ 
      lat: Number(branch.latitude), lng: Number(branch.longitude) }));
    map.fitBounds(bounds);
    if (filtered.length === 1) map.setZoom(15);
  }, [map, filtered, city]);

  const handleMarkerClick = useCallback(branch => {
    setSelected(branch);
    map?.panTo({ lat: Number(branch.latitude), lng: Number(branch.longitude) });
    map?.setZoom(15);
  }, [map]);

  const handleBranchClick = useCallback(branch => {
    setSelected(branch);
    map?.panTo({ lat: Number(branch.latitude), lng: Number(branch.longitude) });
    map?.setZoom(15);
  }, [map]);

  const formatAddress = branch => [branch.street, branch.house_number].filter(Boolean).join(", ");

  const handleOrderClick = () => {
    if (!user) openLogin();
    else setIsNovaPoshtaOpen(true);
  };

  return (
    <section id="location" className={s.location}>
      <div className={s.container}>
        <h2 className={s.title}>{t("location.title")}</h2>
        <p className={s.subtitle}>{t("location.subtitle")}</p>

        {isLoading ? (
          <p className={s.loading}>{t("location.loading")}</p>
        ) : (
          <>
            <div className={s.controls}>
              <div className={s.cityTabs}>
                {cities.map(c => (
                  <button
                    key={c}
                    className={`${s.cityTab} ${city === c ? s.cityTabActive : ""}`}
                    onClick={() => { setCity(c); setSelected(null); }}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div className={s.mapLayout}>
              <aside className={s.branchList}>
                {filtered.map(branch => (
                  <div
                    key={branch.id}
                    className={`${s.branchCard} ${selected?.id === branch.id ? s.branchCardActive : ""}`}
                    onClick={() => handleBranchClick(branch)}
                  >
                    <div className={s.branchDot}></div>
                    <div className={s.branchInfo}>
                      <div className={s.branchName}>{t("location.branchName", { city: branch.city })}</div>
                      <div className={s.branchAddress}>{formatAddress(branch)}</div>
                      <a href={`tel:${branch.phone_number}`} className={s.branchPhone} onClick={e => e.stopPropagation()}>
                        {branch.phone_number}
                      </a>
                    </div>
                  </div>
                ))}
              </aside>

              <div className={s.mapWrap}>
                {isLoaded ? (
                  <GoogleMap mapContainerClassName={s.map} center={UKRAINE_CENTER} zoom={6} options={MAP_OPTIONS} onLoad={handleMapLoad}>
                    {filtered.map(branch => (
                      <Marker
                        key={branch.id}
                        position={{ lat: Number(branch.latitude), lng: Number(branch.longitude) }}
                        icon={MARKER_ICON}
                        title={t("location.branchName", { city: branch.city })}
                        onClick={() => handleMarkerClick(branch)}
                      />
                    ))}
                    {selected && (
                      <InfoWindow
                        position={{ lat: Number(selected.latitude), lng: Number(selected.longitude) }}
                        onCloseClick={() => setSelected(null)}
                      >
                        <div className={s.infoWindow}>
                          <strong className={s.infoName}>{t("location.branchName", { city: selected.city })}</strong>
                          <p className={s.infoAddress}>{formatAddress(selected)}</p>
                          <a href={`tel:${selected.phone_number}`} className={s.infoPhone}>{selected.phone_number}</a>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : (
                  <div className={s.mapLoading}><span>{t("location.mapLoading")}</span></div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className={s.cta}>
        <div className={s.ctaInner}>
          <p className={s.ctaText}>
            {t("location.ctaText")} <strong>{t("location.ctaBold")}</strong>
          </p>
          <button className={btn.btnPrimary} onClick={handleOrderClick}>{t("location.orderBtn")}</button>
        </div>
      </div>

      {isNovaPoshtaOpen && <NovaPoshtaModal onClose={() => setIsNovaPoshtaOpen(false)} />}
    </section>
  );
}