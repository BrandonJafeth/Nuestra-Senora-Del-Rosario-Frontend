

import { useQuery } from 'react-query';
import volunteerSectionservice from '../services/VolunteerSectionService';

export const useVolunteerTypes = () => {
    return useQuery('volunteerTypes', async () => {
        const response = await volunteerSectionservice.getAllVolunteerTypes(); // Llamada al método correcto
        return response.data;
    });
};
