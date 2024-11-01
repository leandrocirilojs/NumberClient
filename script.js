// Função para carregar os contatos do LocalStorage e exibi-los como links
function loadContacts() {
    const chatList = document.getElementById("chat-list");
    chatList.innerHTML = ""; // Limpa a lista antes de carregar
    
    // Obtém os contatos do LocalStorage (ou um array vazio se não houver contatos)
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];

    // Adiciona cada contato na lista de chats
    contacts.forEach((contact, index) => {
        const chatDiv = document.createElement("div");
        chatDiv.classList.add("chat");

        chatDiv.innerHTML = `<a href="https://wa.me/${contact}" target="_blank">
            <img src="https://poloshoppingindaiatuba.com.br/assets/images/732e11da931f0081ab573c6bf3f38459.jpg" alt="User">
            <div class="chat-info">
                <h2>Contato ${index + 1}</h2>
                <p>Número: ${contact}</a></p>
            </div>
            <span class="time">Agora</span>
        `;
        chatList.appendChild(chatDiv);
    });
}

// Função para adicionar um novo contato e salvar no LocalStorage
function addContact() {
    const phoneInput = document.getElementById("phone-input");
    const messageInput = document.getElementById("message-input");
    const phoneNumber = phoneInput.value.trim();
    const message = messageInput.value.trim();

    // Verifica se o número de telefone é válido (apenas dígitos)
    const phoneRegex = /^[0-9]+$/; // Apenas números
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
        alert("Por favor, insira um número de telefone válido.");
        return;
    }

    // Extrai a primeira palavra do campo de mensagem como nome do contato
    const contactName = message.split(" ")[0];

    // Se o número for válido, continua o processo
    const contacts = JSON.parse(localStorage.getItem("contacts")) || [];
    contacts.push({ name: contactName, number: phoneNumber, message: message });

    localStorage.setItem("contacts", JSON.stringify(contacts));

    phoneInput.value = "";
    messageInput.value = ""; // Limpa o campo de mensagem
    loadContacts();

    // Redireciona para o WhatsApp com o número e a mensagem
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}
// Carrega os contatos ao iniciar a página
window.onload = loadContacts;
