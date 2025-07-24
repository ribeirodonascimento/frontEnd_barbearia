// Estado da aplicação
let selectedService = null;

// Mapeamento dos serviços
const services = {
  'corte-tradicional': {
    name: 'Corte Tradicional',
    price: 'R$ 35,00'
  },
  'barba-completa': {
    name: 'Barba Completa',
    price: 'R$ 25,00'
  },
  'combo-premium': {
    name: 'Combo Premium',
    price: 'R$ 55,00'
  }
};

// Função para mostrar toast
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// Função para formatar data
function formatDate(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}

// Função para verificar se é domingo
function isWeekend(dateString) {
  const date = new Date(dateString + 'T00:00:00');
  return date.getDay() === 0; // 0 = domingo
}

// Função para definir datas mínima e máxima
function setDateLimits() {
  const dateInput = document.getElementById('date');
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);
  
  dateInput.min = today.toISOString().split('T')[0];
  dateInput.max = maxDate.toISOString().split('T')[0];
}

// Função para selecionar serviço
function selectService(serviceId) {
  // Remove seleção anterior
  document.querySelectorAll('.service-card').forEach(card => {
    card.classList.remove('selected');
    const button = card.querySelector('.service-button');
    button.textContent = 'Selecionar';
  });
  
  // Adiciona nova seleção
  const selectedCard = document.querySelector(`[data-service="${serviceId}"]`);
  selectedCard.classList.add('selected');
  const button = selectedCard.querySelector('.service-button');
  button.textContent = 'Selecionado';
  
  selectedService = serviceId;
  
  // Mostra o formulário e esconde o prompt
  document.getElementById('bookingPrompt').style.display = 'none';
  document.getElementById('bookingForm').style.display = 'block';
  
  // Scroll para o formulário
  document.getElementById('bookingForm').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
}

// Função para enviar agendamento
function submitBooking(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  
  // Validações
  if (!selectedService) {
    showToast('Por favor, selecione um serviço antes de agendar!', 'error');
    return;
  }
  
  if (isWeekend(date)) {
    showToast('Não trabalhamos aos domingos. Escolha outro dia!', 'error');
    return;
  }
  
  if (!name || !phone || !date || !time) {
    showToast('Por favor, preencha todos os campos!', 'error');
    return;
  }
  
  // Preparar mensagem para WhatsApp
  const service = services[selectedService];
  const formattedDate = formatDate(date);
  
  const message = `🔸 *AGENDAMENTO BARBEARIA PREMIUM* 🔸

👤 *Nome:* ${name}
📞 *Telefone:* ${phone}
✂️ *Serviço:* ${service.name} (${service.price})
📅 *Data:* ${formattedDate}
⏰ *Horário:* ${time}

Gostaria de confirmar este agendamento!`;

  const whatsappUrl = `https://wa.me/5598999959283?text=${encodeURIComponent(message)}`;
  
  showToast('Redirecionando para WhatsApp para confirmação...', 'success');
  
  setTimeout(() => {
    window.open(whatsappUrl, '_blank');
  }, 1000);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  // Configurar limites de data
  setDateLimits();
  
  // Adicionar event listeners para os cards de serviço
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
      const serviceId = this.getAttribute('data-service');
      selectService(serviceId);
    });
  });
  
  // Adicionar event listener para o formulário
  document.getElementById('appointmentForm').addEventListener('submit', submitBooking);
  
  // Validação em tempo real para domingos
  document.getElementById('date').addEventListener('change', function() {
    if (isWeekend(this.value)) {
      showToast('Não trabalhamos aos domingos. Por favor, escolha outro dia.', 'error');
      this.value = '';
    }
  });
});