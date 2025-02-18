import { useAppointmentsByResident } from '../../hooks/useAppointmentByResidentId';
import LoadingSpinner from './LoadingSpinner';

const AppointmentsList = ({ residentId }: { residentId: number }) => {
  const { 
    data: appointments, 
    isLoading, 
    error 
  } = useAppointmentsByResident(residentId);

  if (isLoading) return <div><LoadingSpinner/></div>;
  if (error) return <div>Error al cargar las citas</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Citas del residente</h2>
      <div className="overflow-x-auto">
        <div className="flex space-x-4">
          {Array.isArray(appointments?.data) && appointments?.data.map((appointment: any) => (
            <div key={appointment.id_Appointment} className="p-3 border rounded-lg min-w-[200px]">
              <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {appointment.time}</p>
              <p><strong>Centro de atención:</strong> {appointment.healthcareCenterName}</p>
              <p><strong>Especialidad:</strong> {appointment.specialtyName}</p>
              <p><strong>Acompañante:</strong> {appointment.companionName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsList;