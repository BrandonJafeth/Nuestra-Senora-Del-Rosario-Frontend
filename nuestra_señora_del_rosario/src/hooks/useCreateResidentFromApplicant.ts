import { useState } from 'react';
import residentsService from '../services/ResidentsService';
import { AxiosError } from 'axios';
import { ResidentPostFromApplicantForm } from '../types/ResidentsType';

export const useCreateResidentfromApplicant = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const createResident = async (data: ResidentPostFromApplicantForm) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);
    try {
      await residentsService.createResidentFromApplicant(data);
      setIsSuccess(true);
    } catch (err) {
      setError(err as AxiosError);
    } finally {
      setIsLoading(false);
    }
  };

  return { createResident, isLoading, error, isSuccess };
};
