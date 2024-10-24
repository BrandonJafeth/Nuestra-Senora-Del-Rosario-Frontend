// src/components/microcomponents/NotesComponent.tsx
import React, { useEffect, useState } from 'react';
import { useNotes } from '../../hooks/useNotes'; // Hook para obtener las notas
import LoadingSpinner from './LoadingSpinner'; // Spinner opcional

const NotesComponent: React.FC = () => {
  const { data: notesData, isLoading, error } = useNotes();
  const [notes, setNotes] = useState<any[]>([]);

  // Guardar las notas en el estado cuando estén disponibles
  useEffect(() => {
    if (notesData) {
      setNotes(notesData.data);
    }
  }, [notesData]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <p>Error al cargar las notas: {String(error)}</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        Notas
      </h2>

      {notes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">
          No tienes notas pendientes.
        </p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li
              key={note.id_Note}
              className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <strong className="text-blue-800 dark:text-blue-300 text-lg">
                  {note.reason}
                </strong>
                <p className="text-gray-700 dark:text-gray-400 mt-1">
                  {note.description}
                </p>
                <span className="text-sm text-gray-500 dark:text-gray-300">
                  <p>Fecha: {new Date(note.createdAt).toLocaleDateString('es-CR')} </p>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotesComponent;
