import axios from 'axios';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND}/admin/meetings`,
    withCredentials: true,
});

// Fetch all meetings
export const getMeetings = async () => {
    try {
        return await axios.get(`${process.env.REACT_APP_BACKEND}/admin/meetings`);
    } catch (error) {
        console.error('Error fetching meetings:', error);
        throw error;
    }
};

// Get one meeting by ID
export const getMeetingById = async (id) => {
    try {
        return await API.get(`${process.env.REACT_APP_BACKEND}/admin/meetings/${id}`);
    } catch (error) {
        console.error('Error fetching meeting by ID:', error);
        throw error;
    }
};

// Create a new meeting
export const createMeeting = async (meetingData) => {
    try {
        return await API.post(`${process.env.REACT_APP_BACKEND}/admin/meetings`, meetingData);
    } catch (error) {
        console.error('Error creating meeting:', error);
        throw error;
    }
};

// Update a meeting by ID
export const updateMeeting = async (id, updatedData) => {
    try {
        return await API.put(`${process.env.REACT_APP_BACKEND}/admin/meetings/${id}`, updatedData);
    } catch (error) {
        console.error('Error updating meeting:', error);
        throw error;
    }
};

// Delete a meeting by ID
export const deleteMeeting = async (id) => {
    try {
        return await API.delete(`${process.env.REACT_APP_BACKEND}/admin/meetings/${id}`);
    } catch (error) {
        console.error('Error deleting meeting:', error);
        throw error;
    }
};

// Register a user for a meeting
export const registerForMeeting = async (registrationData) => {
    try {
        return await API.post(`${process.env.REACT_APP_BACKEND}/admin/meetings/register`, registrationData);
    } catch (error) {
        console.error('Error registering for meeting:', error);
        throw error;
    }
};

// Get all registrations for a specific meeting (admin use)
export const getMeetingRegistrations = async (meetingId) => {
    try {
        return await API.get(`${process.env.REACT_APP_BACKEND}/admin/meetings/${meetingId}/registrations`);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        throw error;
    }
};
