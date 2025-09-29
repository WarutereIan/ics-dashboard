import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Globe, Clock, Target } from 'lucide-react';
import { LocationQuestion } from '../../form-creation-wizard/types';
import { BaseQuestionRenderer } from './BaseQuestionRenderer';

interface LocationQuestionRendererProps {
  question: LocationQuestion;
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  isPreviewMode?: boolean;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  address?: string;
}

export function LocationQuestionRenderer({ 
  question, 
  value, 
  onChange, 
  disabled = false,
  isPreviewMode = false 
}: LocationQuestionRendererProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Check if geolocation is supported
  const isGeolocationSupported = () => {
    return 'geolocation' in navigator;
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsCapturing(true);
    setError(null);

    const options = {
      enableHighAccuracy: question.enableHighAccuracy ?? true,
      timeout: question.timeout ?? 10000,
      maximumAge: 60000 // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };

        // Get address if requested
        if (question.captureAddress) {
          getAddressFromCoordinates(locationData.latitude, locationData.longitude)
            .then(address => {
              locationData.address = address;
              onChange?.(locationData);
            })
            .catch(() => {
              onChange?.(locationData);
            });
        } else {
          onChange?.(locationData);
        }

        setIsCapturing(false);
      },
      (error) => {
        setIsCapturing(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access was denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while getting location.');
        }
      },
      options
    );
  };

  // Get address from coordinates using reverse geocoding
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      return data.display_name || 'Address not available';
    } catch {
      return 'Address not available';
    }
  };

  // Handle manual coordinate input
  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid coordinates.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90.');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180.');
      return;
    }

    const locationData: LocationData = {
      latitude: lat,
      longitude: lng,
      timestamp: Date.now()
    };

    onChange?.(locationData);
    setShowManualInput(false);
    setError(null);
  };

  // Format coordinates for display
  const formatCoordinates = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
  };

  // Format accuracy for display
  const formatAccuracy = (accuracy?: number) => {
    if (!accuracy) return 'Unknown';
    if (accuracy < 10) return 'Very High (< 10m)';
    if (accuracy < 50) return 'High (< 50m)';
    if (accuracy < 100) return 'Medium (< 100m)';
    return 'Low (> 100m)';
  };

  return (
    <BaseQuestionRenderer question={question}>
      <div className="space-y-4">
        {/* Location Display */}
        {value && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-green-900 mb-2">Location Captured</h4>
                  <div className="space-y-1 text-sm">
                    <p className="text-green-800">
                      <strong>Coordinates:</strong> {formatCoordinates(value.latitude, value.longitude)}
                    </p>
                    {value.accuracy && (
                      <p className="text-green-800">
                        <strong>Accuracy:</strong> {formatAccuracy(value.accuracy)}
                      </p>
                    )}
                    {value.address && (
                      <p className="text-green-800">
                        <strong>Address:</strong> {value.address}
                      </p>
                    )}
                    <p className="text-green-700 text-xs">
                      Captured: {new Date(value.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange?.(null)}
                  disabled={disabled || isPreviewMode}
                  className="text-green-600 hover:text-green-700"
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Capture Options */}
        {!value && (
          <div className="space-y-3">
            {/* Auto Capture */}
            <Button
              type="button"
              onClick={getCurrentLocation}
              disabled={disabled || isPreviewMode || isCapturing || !isGeolocationSupported()}
              className="w-full"
              variant="outline"
            >
              {isCapturing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Current Location
                </>
              )}
            </Button>

            {/* Manual Input Toggle */}
            {question.allowManualInput && (
              <Button
                type="button"
                onClick={() => setShowManualInput(!showManualInput)}
                disabled={disabled || isPreviewMode}
                variant="ghost"
                className="w-full"
              >
                <Globe className="w-4 h-4 mr-2" />
                {showManualInput ? 'Hide' : 'Enter Coordinates Manually'}
              </Button>
            )}

            {/* Manual Input Form */}
            {showManualInput && question.allowManualInput && (
              <Card className="border-gray-200">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Latitude
                      </label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., 40.7128"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                        disabled={disabled || isPreviewMode}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Longitude
                      </label>
                      <Input
                        type="number"
                        step="any"
                        placeholder="e.g., -74.0060"
                        value={manualLng}
                        onChange={(e) => setManualLng(e.target.value)}
                        disabled={disabled || isPreviewMode}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleManualSubmit}
                    disabled={disabled || isPreviewMode || !manualLat || !manualLng}
                    className="w-full"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Set Location
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Browser Support Warning */}
            {!isGeolocationSupported() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Location capture is not supported in this browser. Please use a modern browser with GPS support.
                </p>
              </div>
            )}

            {/* Settings Info */}
            <div className="text-xs text-gray-500 space-y-1">
              {question.enableHighAccuracy && (
                <p>• High accuracy GPS enabled</p>
              )}
              {question.accuracy && (
                <p>• Required accuracy: {question.accuracy}m</p>
              )}
              {question.timeout && (
                <p>• Timeout: {question.timeout / 1000}s</p>
              )}
              {question.captureAddress && (
                <p>• Address will be captured automatically</p>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseQuestionRenderer>
  );
}
