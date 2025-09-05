
const API_KEY = AIzaSyCzbvCIvp12fNriJ0oRPE206clxpqQhr-U; 


const SYSTEM_PROMPT = 
`Eres un asistente virtual de la empresa Fixed Home.
que se dedica a emparejar un potencial cliente con un profesional de confianza.
Solo debes responder preguntas relacionadas con:
- los servicios que ofrecemos: servicios de mantenimiento y reparacion del hogar, 
Plomeria , electricidad, pintura, limpieza, cerrajeria, jardineria, agregar ver mas en la pagina
- Precios, soporte técnico y garantías.
- Horarios de atención y disponibilidad.
- Proceso de contratación y formas de pago.
- Ubicación y áreas de servicio.
- Políticas de privacidad y términos de servicio.
- podes contratar mas de un servicio a la vez
- podes solicitar un presupuesto sin compromiso
- podes cancelar un servicio con 24 horas de anticipacion
- podes reprogramar un servicio con 12 horas de anticipacion
los profesionales son evaluados por los clientes
- Podes dejar una reseña despues de que el servicio haya sido completado- podes solicitar un profesional en particular si ya lo conoces
 -Los profesionales son verificados y asegurados con certificados y licencias vigentes 
 verificamos los antecedentes penales y referencias de todos nuestros profesionales
Contas con una garantia de satisfaccion de 30 dias en todos los servicios
- podes solicitar un servicio de emergencia 24/7
- podes solicitar un servicio recurrente con descuento
- podes solicitar un servicio de mantenimiento preventivo
- podes solicitar un servicio de inspeccion del hogar
- podes solicitar un servicio de limpieza profunda
- podes solicitar un servicio de reparacion urgente
- Formas de pago aceptadas: tarjetas de credito, debito, transferencias bancarias y efectivo
- promociones y descuentos vigentes
- podes solicitar un servicio para una fecha y hora especifica
- podes solicitar un servicio para un evento especial
- podes revisar los datos del profesional antes de contratarlo asi sea, 
nombre completo, foto, calificacion, reseñas y servicios ofrecidos en la aplicacion
Si te preguntan algo fuera de esto, responde educadamente:
Lo siento, solo puedo ayudarte con servicios relacionados a fixed home.
Si te preguntan algo de la aplicacion y no tenes informacion redirigilo a contactarse con
 un soporte virtual de fixed home

Responde de forma clara, breve y amable siempre de usted`
;

// Elementos del DOM
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// Función para añadir mensajes al chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
}

// Enviar mensaje del usuario
function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  userInput.value = '';

  // Mostrar "escribiendo..."
  addMessage("🤔 Gemini está pensando...", 'bot');
  const lastMessage = chatBox.lastChild;

  // Construir el prompt completo (instrucción + pregunta del usuario)
  const fullPrompt = SYSTEM_PROMPT + "\n\nPregunta del usuario: " + text;

  // Llamar a la API de Gemini
  fetch(`AIzaSyCzbvCIvp12fNriJ0oRPE206clxpqQhr-U`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: fullPrompt
            }
          ]
        }
      ]
    })
  })
  .then(response => response.json())
  .then(data => {
    // Eliminar mensaje "escribiendo..."
    chatBox.removeChild(lastMessage);

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      const botReply = data.candidates[0].content.parts[0].text.trim();
      addMessage(botReply, 'bot');
    } else {
      addMessage("Lo siento, no pude generar una respuesta.", 'bot');
      console.log("Respuesta completa de Gemini:", data); // Para debug
    }
  })
  .catch(error => {
    chatBox.removeChild(lastMessage);
    addMessage("⚠️ Error al conectar con Gemini.", 'bot');
    console.error("Error:", error);
  });
}

// Eventos
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Mensaje de bienvenida
addMessage("¡Hola! 👋 Soy tu asistente virtual con IA de Google Gemini. ¿En qué puedo ayudarte?", 'bot');