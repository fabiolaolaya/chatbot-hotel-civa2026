'use client';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- CONEXIÓN A BASE DE DATOS ---
const supabaseUrl = 'https://whxekpmtvckkftfzbjeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoeGVrcG10dmNra2Z0ZnpiamVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0Njc1NzEsImV4cCI6MjEwNDA0MzU3MX0.BkrtvpDjCLL402N-4JWkT_p7G979hSkkJXVOTGMJ2Lk';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
// --------------------------------------

export default function Home() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: '¡Hola! / Hello! / Olá! / Bonjour! / Ciao! 🏨\n\nSoy el asistente del Hotel CIVA. Puedo ayudarte con:\n🛏️ Habitaciones\n🍽️ Restaurante\n🛠️ Mantenimiento\n📶 Servicios del hotel' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const [flujoActual, setFlujoActual] = useState({ estado: 'inicio', idioma: 'es' });

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userText = inputValue;
    setMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: userText }]);
    setInputValue('');
    setIsTyping(true);

    const textoLimpio = userText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const diccionarios = {
      es: {
        saludos: ['hola', 'buenos dias', 'buenas tardes', 'wenas', 'que tal'],
        despedidas: ['gracias', 'adios', 'chao', 'hasta luego'],
        habitacion: ['habitacion', 'habitaciones', 'cuarto', 'precio', 'dormir', 'alojamiento', 'reservar'],
        restaurante: ['restaurante', 'comida', 'cena', 'almuerzo', 'mesa', 'hambre', 'desayuno', 'cenar'],
        mantenimiento: ['mantenimiento', 'roto', 'daño', 'limpieza', 'toallas', 'aire acondicionado', 'falla', 'sucio', 'aire'],
        servicios: ['piscina', 'gimnasio', 'wifi', 'horario', 'checkout', 'servicios']
      },
      en: {
        saludos: ['hello', 'hi', 'hey', 'good morning'],
        despedidas: ['thanks', 'thank you', 'bye', 'goodbye'],
        habitacion: ['room', 'rooms', 'price', 'book', 'stay', 'reserve'],
        restaurante: ['restaurant', 'food', 'dinner', 'lunch', 'table', 'breakfast'],
        mantenimiento: ['maintenance', 'broken', 'cleaning', 'towels', 'ac', 'dirty'],
        servicios: ['pool', 'gym', 'wifi', 'hours', 'checkout', 'services']
      },
      pt: {
        saludos: ['ola', 'bom dia', 'boa tarde', 'oi'],
        despedidas: ['obrigado', 'obrigada', 'tchau', 'adeus'],
        habitacion: ['quarto', 'quartos', 'preco', 'hospedagem', 'dormir', 'reservar'],
        restaurante: ['restaurante', 'comida', 'jantar', 'almoco', 'mesa', 'cafe'],
        mantenimiento: ['manutencao', 'quebrado', 'limpeza', 'toalhas', 'ar condicionado', 'sujo'],
        servicios: ['piscina', 'academia', 'wifi', 'horario', 'servicos']
      },
      fr: {
        saludos: ['bonjour', 'salut', 'bonsoir'],
        despedidas: ['merci', 'au revoir', 'adieu'],
        habitacion: ['chambre', 'chambres', 'prix', 'dormir', 'reserver'],
        restaurante: ['restaurant', 'nourriture', 'diner', 'dejeuner', 'table'],
        mantenimiento: ['entretien', 'casse', 'nettoyage', 'serviettes', 'sale'],
        servicios: ['piscine', 'gym', 'wifi', 'horaires', 'services']
      },
      it: {
        saludos: ['ciao', 'buongiorno', 'buonasera', 'salve'],
        despedidas: ['grazie', 'arrivederci', 'addio'],
        habitacion: ['camera', 'camere', 'prezzo', 'dormire', 'prenotare'],
        restaurante: ['ristorante', 'cibo', 'cena', 'pranzo', 'tavolo'],
        mantenimiento: ['manutenzione', 'rotto', 'pulizia', 'asciugamani', 'sporco'],
        servicios: ['piscina', 'palestra', 'wifi', 'orari', 'servizi']
      }
    };

    let botResponseText = '';

    try {
      // --- NUEVO FLUJO: RESERVA DE HABITACIÓN ---
      if (flujoActual.estado === 'esperando_reserva_habitacion') {
        await fetch('https://fabiola2026.app.n8n.cloud/webhook-test/civa-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: "Reserva Habitacion",
            cliente: userText,
            fecha: new Date().toLocaleString()
          })
        });

        const respuestasConfHab = {
          es: '¡Excelente! Tu solicitud de reserva ha sido enviada a Recepción. Te esperamos pronto. 🛏️',
          en: 'Excellent! Your reservation request has been sent to Reception. See you soon. 🛏️',
          pt: 'Excelente! O seu pedido de reserva foi enviado para a Recepção. Esperamos você em breve. 🛏️',
          fr: 'Excellent! Votre demande de réservation a été envoyée à la réception. À bientôt. 🛏️',
          it: 'Eccellente! La tua richiesta di prenotazione è stata inviata alla Reception. Ti aspettiamo. 🛏️'
        };
        botResponseText = respuestasConfHab[flujoActual.idioma];
        setFlujoActual({ estado: 'inicio', idioma: 'es' });
      }
      // --- FLUJO: RESERVA RESTAURANTE ---
      else if (flujoActual.estado === 'esperando_restaurante') {
        await supabase.from('restaurante_reservas').insert([
          { nombre_huesped: userText, cantidad_personas: 1, fecha_hora: new Date().toISOString() }
        ]);

        await fetch('https://fabiola2026.app.n8n.cloud/webhook-test/civa-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: "Reserva Restaurante",
            cliente: userText,
            fecha: new Date().toLocaleString()
          })
        });

        const respuestasConfRest = {
          es: '¡Listo! Tu reserva en el restaurante ha sido registrada y enviada a gerencia. ¡Buen provecho! 🍽️',
          en: 'Done! Your restaurant reservation has been registered. Enjoy your meal! 🍽️',
          pt: 'Pronto! Sua reserva no restaurante foi registrada. Bom apetite! 🍽️',
          fr: 'Fait! Votre réservation au restaurant a été enregistrée. Bon appétit! 🍽️',
          it: 'Fatto! La tua prenotazione al ristorante è stata registrata. Buon appetito! 🍽️'
        };
        botResponseText = respuestasConfRest[flujoActual.idioma];
        setFlujoActual({ estado: 'inicio', idioma: 'es' });
      } 
      // --- FLUJO: MANTENIMIENTO ---
      else if (flujoActual.estado === 'esperando_mantenimiento') {
        await supabase.from('mantenimiento_tickets').insert([
          { numero_habitacion: 'Por revisar', descripcion_problema: userText }
        ]);

        await fetch('https://fabiola2026.app.n8n.cloud/webhook-test/civa-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tipo: "Alerta de Mantenimiento",
            problema: userText,
            fecha: new Date().toLocaleString()
          })
        });

        const respuestasConfMant = {
          es: '¡Reporte enviado! Se ha alertado automáticamente al equipo de mantenimiento. 🛠️',
          en: 'Report sent! Our maintenance team has been alerted right away. 🛠️',
          pt: 'Relatório enviado! Nossa equipe de manutenção foi alertada. 🛠️',
          fr: 'Rapport envoyé! Notre équipe d\'entretien a été alertée. 🛠️',
          it: 'Segnalazione inviata! Il nostro team di manutenzione è stato allertato. 🛠️'
        };
        botResponseText = respuestasConfMant[flujoActual.idioma];
        setFlujoActual({ estado: 'inicio', idioma: 'es' });
      } 
      // --- DETECCIÓN DE INTENCIONES (INICIO) ---
      else {
        let idiomaDetectado = 'es';
        let intencionDetectada = 'desconocido';

        for (const [idioma, intenciones] of Object.entries(diccionarios)) {
          if (intenciones.habitacion.some(p => textoLimpio.includes(p))) { idiomaDetectado = idioma; intencionDetectada = 'habitacion'; break; }
          if (intenciones.restaurante.some(p => textoLimpio.includes(p))) { idiomaDetectado = idioma; intencionDetectada = 'restaurante'; break; }
          if (intenciones.mantenimiento.some(p => textoLimpio.includes(p))) { idiomaDetectado = idioma; intencionDetectada = 'mantenimiento'; break; }
          if (intenciones.servicios.some(p => textoLimpio.includes(p))) { idiomaDetectado = idioma; intencionDetectada = 'servicios'; break; }
          if (intenciones.saludos.some(p => textoLimpio.includes(p))) { idiomaDetectado = idioma; intencionDetectada = 'saludo'; break; }
          if (intenciones.despedidas.some(p => textoLimpio.includes(p))) { idiomaDetectado = idioma; intencionDetectada = 'despedida'; break; }
        }

        if (intencionDetectada === 'habitacion') {
          const { data: habitaciones, error } = await supabase.from('habitaciones').select('*').eq('estado', 'disponible');
          if (!error && habitaciones && habitaciones.length > 0) {
            const respuestasExito = { es: '🏨 Opciones disponibles:\n\n', en: '🏨 Available options:\n\n', pt: '🏨 Opções disponíveis:\n\n', fr: '🏨 Options disponibles:\n\n', it: '🏨 Opzioni disponibili:\n\n' };
            botResponseText = respuestasExito[idiomaDetectado];
            habitaciones.forEach(hab => {
                botResponseText += `✨ ${hab.tipo} (Máx. ${hab.capacidad}) - $${hab.precio_noche}/noche\n`;
            });
            
            const preguntarReserva = {
              es: '\n¿Deseas reservar alguna? Por favor, escribe tu nombre y el tipo de cuarto.',
              en: '\nWould you like to book? Please write your name and the room type.',
              pt: '\nGostaria de reservar? Escreva seu nome e o tipo de quarto.',
              fr: '\nVoulez-vous réserver? Veuillez écrire votre nom et le type de chambre.',
              it: '\nVuoi prenotare? Scrivi il tuo nome e il tipo di camera.'
            };
            botResponseText += preguntarReserva[idiomaDetectado];
            setFlujoActual({ estado: 'esperando_reserva_habitacion', idioma: idiomaDetectado });

          } else {
            botResponseText = 'Lo siento, el hotel está lleno / The hotel is full. 😔';
          }
        } 
        else if (intencionDetectada === 'restaurante') {
          const pedirDatosRest = {
            es: '¡Excelente elección! 🍽️ ¿A nombre de quién hacemos la reserva y para cuántas personas?',
            en: 'Great choice! 🍽️ Under what name and for how many people?',
            pt: 'Ótima escolha! 🍽️ Em que nome e para quantas pessoas?',
            fr: 'Excellent choix! 🍽️ À quel nom et pour combien de personnes?',
            it: 'Ottima scelta! 🍽️ A che nome e per quante persone?'
          };
          botResponseText = pedirDatosRest[idiomaDetectado];
          setFlujoActual({ estado: 'esperando_restaurante', idioma: idiomaDetectado });
        }
        else if (intencionDetectada === 'mantenimiento') {
          const pedirDatosMant = {
            es: 'Lamento el inconveniente. 🛠️ Por favor, indícame tu número de habitación y cuál es el problema.',
            en: 'Sorry for the inconvenience. 🛠️ Please tell me your room number and the issue.',
            pt: 'Desculpe o transtorno. 🛠️ Por favor, diga-me o número do seu quarto e o problema.',
            fr: 'Désolé pour le désagrément. 🛠️ Veuillez m\'indiquer votre numéro de chambre et le problème.',
            it: 'Scusate l\'inconveniente. 🛠️ Per favore dimmi il numero della tua camera e il problema.'
          };
          botResponseText = pedirDatosMant[idiomaDetectado];
          setFlujoActual({ estado: 'esperando_mantenimiento', idioma: idiomaDetectado });
        }
        else if (intencionDetectada === 'servicios') {
          const infoServicios = {
            es: '🏊‍♂️ Piscina: 8am - 10pm\n🏋️ Gimnasio: 24/7\n📶 WiFi: CIVA_Guest (Pass: civa2026)\n⏰ Checkout: 12:00 PM',
            en: '🏊‍♂️ Pool: 8am - 10pm\n🏋️ Gym: 24/7\n📶 WiFi: CIVA_Guest (Pass: civa2026)\n⏰ Checkout: 12:00 PM',
            pt: '🏊‍♂️ Piscina: 8h - 22h\n🏋️ Academia: 24/7\n📶 WiFi: CIVA_Guest (Senha: civa2026)\n⏰ Checkout: 12:00',
            fr: '🏊‍♂️ Piscine: 8h - 22h\n🏋️ Gym: 24/7\n📶 WiFi: CIVA_Guest (Mdp: civa2026)\n⏰ Checkout: 12:00',
            it: '🏊‍♂️ Piscina: 8:00 - 22:00\n🏋️ Palestra: 24/7\n📶 WiFi: CIVA_Guest (Pass: civa2026)\n⏰ Checkout: 12:00'
          };
          botResponseText = infoServicios[idiomaDetectado];
        }
        else if (intencionDetectada === 'saludo') {
          botResponseText = '¡Hola! / Hello! Dime, ¿en qué te puedo ayudar? (Habitaciones, Restaurante, Mantenimiento)';
        }
        else if (intencionDetectada === 'despedida') {
          botResponseText = '¡Ha sido un placer! / It was a pleasure! 👋';
        }
        else {
          botResponseText = 'No entiendo muy bien. 🤔 Prueba pidiendo "habitaciones", "restaurante", "mantenimiento" o "servicios".\n(Try asking for "rooms", "restaurant", or "maintenance")';
        }
      }
    } catch (error) {
      console.error("Error en el flujo:", error);
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', text: botResponseText }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-200 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh] border border-slate-300">
        
        <div className="bg-blue-950 text-white p-4 flex items-center gap-3 shadow-md z-10">
          <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center text-2xl shadow-inner">🏨</div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">Hotel CIVA</h1>
            <p className="text-xs text-blue-200 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              IA Multilingüe 24/7
            </p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`p-3 rounded-2xl shadow-sm max-w-[85%] text-sm whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-blue-950 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white text-slate-400 p-3 rounded-2xl rounded-tl-none border border-slate-200 text-sm italic">
                 Procesando...
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 items-center">
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Escribe aquí / Type here..." 
            className="flex-1 bg-slate-100 text-slate-700 rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-950 transition-all"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isTyping}
            className="bg-blue-950 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-blue-900 transition-all shadow-md disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-1">
              <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
            </svg>
          </button>
        </form>

      </div>
    </main>
  );
}