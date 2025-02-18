// src/hooks/useCreateUser.ts
import { useMutation } from 'react-query';
import { User } from '../types/UserType';
import userManagmentService from '../services/UserManagmentService';

export const useCreateUser = () => {
  return useMutation<User, Error, User>(
    async (newUser) => {
      const response = await userManagmentService.createUser(newUser);
      return response; 
    }
  );
};
