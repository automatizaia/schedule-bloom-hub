
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Página não encontrada</p>
        <Button asChild>
          <Link to="/">Voltar para a página inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
