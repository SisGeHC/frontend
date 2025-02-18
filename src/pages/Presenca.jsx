import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Presenca = () => {
  const { enrollmentId } = useParams();  // Pegando o enrollmentId da URL
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollmentDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://127.0.0.1:8000/enrollments/${enrollmentId}/`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar os detalhes da inscrição');
        }

        const data = await response.json();
        setEnrollment(data);
      } catch (error) {
        console.error('Erro ao carregar detalhes da matrícula:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollmentDetails();
  }, [enrollmentId]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!enrollment) {
    return <p>Inscrição não encontrada.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
      </header>

      {/* Detalhes do Evento */}
      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg flex">
        {/* Informações do Evento */}
        <div className="w-2/3 pr-8">
          <h2 className="text-2xl font-semibold mb-4">{enrollment.event_title}</h2>
          <p><strong>Aluno:</strong> {enrollment.student_name}</p>
          <p><strong>Status de Presença:</strong> {enrollment.attended ? 'Presente' : 'Não presente'}</p>
        </div>

        {/* QR Code */}
        <div className="w-1/3">
          <h3 className="text-xl font-semibold mb-4">QR Code</h3>
          {enrollment.qr_code ? (
            <div className="flex justify-center">
              <img src={enrollment.qr_code} alt="QR Code do Evento" className="w-48 h-48 object-contain" />
            </div>
          ) : (
            <p>QR Code não disponível.</p>
          )}
        </div>
      </div>

      <footer className="bg-green-700 text-white text-center p-4 mt-6">
        <p>Sistema criado para fins acadêmicos</p>
        <p>Governo do Estado do Ceará</p>
        <p>Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
};

export default Presenca;

