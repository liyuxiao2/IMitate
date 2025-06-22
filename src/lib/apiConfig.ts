// API configuration for different environments
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL || 'https://your-fastapi-backend.railway.app'
  : 'http://localhost:8000';

export const apiEndpoints = {
  getProfile: `${API_BASE_URL}/getProfile`,
  getLeaderboard: `${API_BASE_URL}/getLeaderboard`,
  updateProfilePicture: `${API_BASE_URL}/updateProfilePicture`,
  addScore: `${API_BASE_URL}/addScore`,
  addMatch: `${API_BASE_URL}/addMatch`,
  chat: `${API_BASE_URL}/chat`,
  evaluate: `${API_BASE_URL}/evaluate`,
  getRandomPatient: `${API_BASE_URL}/patients/random`,
  fetchHistory: `${API_BASE_URL}/fetchHistory`,
}; 