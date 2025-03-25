// FILE: src/components/PageNotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="mt-4 text-xl">Lo siento, la página que buscas no existe.</p>
      <Link to="/dashboard" className="mt-6 text-blue-500 underline">
        Volver al inicio
      </Link>
    </div>
  );
};

export default PageNotFound;
