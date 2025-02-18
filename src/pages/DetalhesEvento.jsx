import React from 'react';

const EventoDetalhes = ({ evento }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-r from-green-500 to-green-700 p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">SISGEHC</h1>
        <div className="relative">
          <button className="text-white text-2xl focus:outline-none">
            👤
          </button>
        </div>
      </header>

      {/* Detalhes do Evento */}
      <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg flex">
        {/* Informações do Evento */}
        <div className="w-2/3 pr-8">
          <h2 className="text-2xl font-semibold mb-4">{evento.title}</h2>
          <p className="text-sm text-gray-600"><strong>Data:</strong> {evento.dates[0]?.day}</p>
          <p className="text-sm text-gray-600"><strong>Local:</strong> {evento.location}</p>
          <p className="text-sm text-gray-600"><strong>Horário:</strong> {evento.dates[0]?.start_time} - {evento.dates[0]?.end_time}</p>
          <p className="text-sm text-gray-600"><strong>Descrição:</strong> {evento.description}</p>
          <p className="text-sm text-gray-600"><strong>Carga Horária:</strong> {evento.hours_taken} horas</p>
        </div>

        {/* QR Code */}
        <div className="w-1/3">
          <h3 className="text-xl font-semibold mb-4">QR Code</h3>
          <div className="flex justify-center">
            <img src={evento.qr_code} alt="QR Code do Evento" className="w-48 h-48 object-contain" />
          </div>
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

export default EventoDetalhes;



