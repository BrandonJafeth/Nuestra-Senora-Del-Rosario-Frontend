import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import userService from '../services/UserService'; // Servicio para asignar roles
import roleService from '../services/RolesServices'; // Servicio para obtener roles
import { useToast } from './useToast'; // Importa el hook de Toast

export const useRoles = (employeeDni: number) => {
  // Estado para el rol seleccionado
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const { showToast } = useToast(); // Usa el hook de Toast

  // Hook para obtener los roles desde el servicio
  const { data: roles, isLoading: isLoadingRoles, isError: isErrorRoles } = useQuery('roles', async () => {
    const response = await roleService.getAllRoles();
    return response.data;
  });

  // Mutación para asignar el rol al empleado
  const assignRoleMutation = useMutation(() => {
    if (selectedRole) {
      // Asigna el rol seleccionado al empleado
      return userService.assignRoleToEmployee(employeeDni, selectedRole);
    }
    return Promise.reject("No role selected");
  });

  // Manejar el cambio de rol seleccionado
  const handleRoleChange = (roleId: number) => {
    setSelectedRole(roleId);
  };

  // Manejar la asignación del rol seleccionado
  const handleSubmit = (onSuccessCallback: () => void) => {
    if (!selectedRole) {
      showToast("Por favor seleccione un rol antes de continuar.", 'warning');
      return;
    }

    assignRoleMutation.mutate(undefined, {
      onSuccess: () => {
        showToast('Rol asignado correctamente.', 'success'); // Mostrar toast de éxito
        onSuccessCallback();
      },
      onError: () => {
        showToast('Error al asignar el rol. Intente nuevamente.', 'error'); // Mostrar toast de error
      },
    });
  };

  return {
    roles,
    isLoadingRoles,
    isErrorRoles,
    selectedRole,
    handleRoleChange,
    handleSubmit,
    assignRoleMutation,
  };
};
