import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { useProjects } from '@/contexts/ProjectsContext';
import { OutcomeSelector } from './OutcomeSelector';
import { OutputSelector } from './OutputSelector';
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
  const { user } = useAuth();
  const { currentProject } = useDashboard();
  const { getProjectOutcomes, getProjectOutputs } = useProjects();
  const [selectedOutcome, setSelectedOutcome] = useState<string | undefined>(undefined);
  const [selectedOutput, setSelectedOutput] = useState<string | undefined>(undefined);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (user && currentProject) {
        try {
          const [outcomesData, outputsData] = await Promise.all([
            getProjectOutcomes(currentProject.id),
            getProjectOutputs(currentProject.id)
          ]);
          setOutcomes(outcomesData);
          setOutputs(outputsData);
        } catch (error) {
          console.error('Error loading map data:', error);
        }
      }
    };

    loadData();
  }, [user, currentProject, getProjectOutcomes, getProjectOutputs]);

  useEffect(() => {
    // Filter outputs based on selected outcome
    const loadOutputs = async () => {
      if (user && currentProject) {
        try {
          const outputsData = await getProjectOutputs(currentProject.id);
          const filteredOutputs = selectedOutcome
            ? outputsData.filter((o: any) => o.outcomeId === selectedOutcome)
            : outputsData;
          setOutputs(filteredOutputs);
        } catch (error) {
          console.error('Error loading filtered outputs:', error);
        }
      }
    };

    loadOutputs();
  }, [selectedOutcome, user, currentProject, getProjectOutputs]);

  if (!user || !currentProject) return null;

  // Center map based on project country
  let mapCenter = KENYA_CENTER;
  if (currentProject.country?.toLowerCase().includes('tanzania')) {
    mapCenter = TANZANIA_CENTER;
  }
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
        {user && (
          <OutcomeSelector
            user={user}
            projectId={currentProject.id}
            value={selectedOutcome}
            onSelect={id => {
              setSelectedOutcome(id);
              setSelectedOutput(undefined);
            }}
          />
        )}
        {user && (
          <OutputSelector
            user={user}
            projectId={currentProject.id}
            outcomeId={selectedOutcome}
            value={selectedOutput}
            onSelect={setSelectedOutput}
          />
        )}
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