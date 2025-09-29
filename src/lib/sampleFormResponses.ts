import { FormResponse } from '@/components/dashboard/form-creation-wizard/types';

// Sample location data points around Kenya
const sampleLocations = [
  { lat: -1.2921, lng: 36.8219, address: 'Nairobi, Kenya' }, // Nairobi
  { lat: -1.2625, lng: 36.8607, address: 'Mathare, Nairobi, Kenya' }, // Mathare
  { lat: -1.3129, lng: 36.7870, address: 'Kibera, Nairobi, Kenya' }, // Kibera
  { lat: -1.2394, lng: 36.8956, address: 'Korogocho, Nairobi, Kenya' }, // Korogocho
  { lat: -1.3175, lng: 36.8901, address: 'Mukuru, Nairobi, Kenya' }, // Mukuru
  { lat: -0.3031, lng: 36.0800, address: 'Nakuru, Kenya' }, // Nakuru
  { lat: -0.4167, lng: 36.9500, address: 'Nyeri, Kenya' }, // Nyeri
  { lat: -0.5167, lng: 37.4500, address: 'Embu, Kenya' }, // Embu
  { lat: -0.6833, lng: 36.4333, address: 'Naivasha, Kenya' }, // Naivasha
  { lat: -0.5167, lng: 35.2833, address: 'Kericho, Kenya' }, // Kericho
];

// Sample form questions that might contain location data
const sampleLocationQuestions = [
  'location_visit',
  'site_location',
  'intervention_location',
  'participant_location',
  'activity_location',
  'monitoring_location',
  'training_location',
  'assessment_location',
  'survey_location',
  'meeting_location'
];

// Generate sample form responses with location data
export function generateSampleFormResponses(projectId: string): FormResponse[] {
  const responses: FormResponse[] = [];
  
  // Generate responses for the last 30 days
  for (let i = 0; i < 25; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - daysAgo);
    
    const startedAt = new Date(submittedAt);
    startedAt.setMinutes(startedAt.getMinutes() - Math.floor(Math.random() * 30));
    
    // Randomly select a location
    const location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    const questionId = sampleLocationQuestions[Math.floor(Math.random() * sampleLocationQuestions.length)];
    
    // Create response data with location
    const responseData: Record<string, any> = {
      [questionId]: {
        latitude: location.lat + (Math.random() - 0.5) * 0.01, // Add some variation
        longitude: location.lng + (Math.random() - 0.5) * 0.01,
        accuracy: Math.floor(Math.random() * 50) + 5, // 5-55 meters accuracy
        address: location.address
      },
      // Add some other sample data
      participant_name: `Participant ${i + 1}`,
      activity_type: ['Training', 'Monitoring', 'Assessment', 'Meeting', 'Survey'][Math.floor(Math.random() * 5)],
      participants_count: Math.floor(Math.random() * 50) + 5,
      notes: `Sample response ${i + 1} with location data for testing map visualization.`
    };
    
    const response: FormResponse = {
      id: `response-${Date.now()}-${i}`,
      formId: `form-${Math.floor(Math.random() * 3) + 1}`, // Random form ID
      formVersion: 1,
      startedAt,
      submittedAt,
      isComplete: true,
      data: responseData,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      source: 'direct'
    };
    
    responses.push(response);
  }
  
  return responses;
}

// Add sample responses to localStorage for testing
export function addSampleFormResponsesToStorage(projectId: string): void {
  try {
    const sampleResponses = generateSampleFormResponses(projectId);
    
    // Get existing responses
    const existingResponses = localStorage.getItem('formResponses');
    const allResponses = existingResponses ? JSON.parse(existingResponses) : {};
    
    // Group responses by form ID
    sampleResponses.forEach(response => {
      if (!allResponses[response.formId]) {
        allResponses[response.formId] = [];
      }
      allResponses[response.formId].push(response);
    });
    
    // Save back to localStorage
    localStorage.setItem('formResponses', JSON.stringify(allResponses));
    
    console.log(`Added ${sampleResponses.length} sample form responses with location data for project ${projectId}`);
  } catch (error) {
    console.error('Error adding sample form responses:', error);
  }
}

// Check if sample data exists for a project
export function hasSampleFormResponses(projectId: string): boolean {
  try {
    const existingResponses = localStorage.getItem('formResponses');
    if (!existingResponses) return false;
    
    const allResponses = JSON.parse(existingResponses);
    const projectFormIds = Object.keys(allResponses).filter(formId => 
      formId.startsWith('form-') // Sample forms start with 'form-'
    );
    
    return projectFormIds.length > 0;
  } catch (error) {
    return false;
  }
}

// Clear sample form responses
export function clearSampleFormResponses(): void {
  try {
    const existingResponses = localStorage.getItem('formResponses');
    if (!existingResponses) return;
    
    const allResponses = JSON.parse(existingResponses);
    const filteredResponses: Record<string, any> = {};
    
    // Keep only non-sample responses
    Object.keys(allResponses).forEach(formId => {
      if (!formId.startsWith('form-')) {
        filteredResponses[formId] = allResponses[formId];
      }
    });
    
    localStorage.setItem('formResponses', JSON.stringify(filteredResponses));
    console.log('Cleared sample form responses');
  } catch (error) {
    console.error('Error clearing sample form responses:', error);
  }
}

