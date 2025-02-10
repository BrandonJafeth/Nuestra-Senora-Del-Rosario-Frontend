import { useMutation } from 'react-query';
import { CreateUserFromEmployeeRequest, CreateUserFromEmployeeResponse } from '../types/UserFromEmployeeType';
import createUserFromEmployeeService from '../services/UserFromEmployeeService';

export const useCreateUserFromEmployee = () => {
return useMutation<CreateUserFromEmployeeResponse, Error, CreateUserFromEmployeeRequest>(
    async (newUser: CreateUserFromEmployeeRequest): Promise<CreateUserFromEmployeeResponse> => {
        const response = await createUserFromEmployeeService.createUserFromEmployee(newUser);
        return {
            ...response.data
        }; // ✅ Retorna solo `data` para usarla directamente en los componentes
    }
);
};
