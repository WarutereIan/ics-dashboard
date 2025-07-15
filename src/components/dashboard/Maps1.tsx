import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useDashboard } from '@/contexts/DashboardContext';
import { OutcomeSelector } from './OutcomeSelector';
import { OutputSelector } from './OutputSelector';
import { getProjectOutcomes, getProjectOutputs } from '@/lib/icsData';
import { LatLngTuple } from 'leaflet';

// Fix default marker icon issue in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const KENYA_CENTER: LatLngTuple = [-1.286389, 36.817223];
const TANZANIA_CENTER: LatLngTuple = [-6.792354, 39.208328];

export function Maps() {
  const { currentProject, user } = useDashboard();
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);

  if (!currentProject) {
    return <div>No project selected</div>;
  }

  // Center map based on project country
  let mapCenter = KENYA_CENTER;
  if (currentProject.country?.toLowerCase().includes('tanzania')) {
    mapCenter = TANZANIA_CENTER;
  }

  // Get selected outcome/output
  const outcomes = getProjectOutcomes(user, currentProject.id);
  const outputs = selectedOutcome
    ? getProjectOutputs(user, currentProject.id).filter((o: any) => o.outcomeId === selectedOutcome)
    : getProjectOutputs(user, currentProject.id);
  const selectedOutcomeObj = outcomes.find((o: any) => o.id === selectedOutcome);
  const selectedOutputObj = outputs.find((o: any) => o.id === selectedOutput);

  // Marker position: just use the center as a placeholder
  const markerPosition = mapCenter;
  const popupTitle = selectedOutputObj?.title || selectedOutcomeObj?.title || currentProject.name;
  const popupDescription = selectedOutputObj?.description || selectedOutcomeObj?.description || currentProject.description;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground mb-2">Map View</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <OutcomeSelector
          user={user}
          projectId={currentProject.id}
          value={selectedOutcome}
          onSelect={id => {
            setSelectedOutcome(id);
            setSelectedOutput(undefined);
          }}
        />
        <OutputSelector
          user={user}
          projectId={currentProject.id}
          outcomeId={selectedOutcome}
          value={selectedOutput}
          onSelect={setSelectedOutput}
        />
      </div>
      <div className="w-full h-[500px] rounded-lg overflow-hidden border">
        <MapContainer center={mapCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={markerPosition}>
            <Popup>
              <div>
                <strong>{popupTitle}</strong>
                <div className="text-sm text-muted-foreground">{popupDescription}</div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
} 