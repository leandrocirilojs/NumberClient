const app = Vue.createApp({
  data() {
    return {
      loginUsuario: '',
      loginSenha: '',
      usuarioLogado: false,
      novoCliente: { nome: '', email: '' },
      clientes: [],
      clienteEmEdicao: null,
      termoBusca: ''
    };
  },
  computed: {
    clientesFiltrados() {
      if (this.termoBusca.trim() === '') {
        return this.clientes;
      }
      const termo = this.termoBusca.toLowerCase();
      return this.clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(termo) ||
        cliente.email.toLowerCase().includes(termo)
      );
    }
  },
  methods: {
    carregarClientes() {
      const dadosSalvos = localStorage.getItem('clientes');
      if (dadosSalvos) {
        this.clientes = JSON.parse(dadosSalvos);
      }
    },
    salvarClientes() {
      localStorage.setItem('clientes', JSON.stringify(this.clientes));
    },
    autenticar() {
      if (this.loginUsuario === 'admin' && this.loginSenha === '1234') {
        this.usuarioLogado = true;
        localStorage.setItem('usuarioLogado', 'true');
        Swal.fire('Login Bem-Sucedido!', 'Bem-vindo ao sistema!', 'success');
      } else {
        Swal.fire('Erro!', 'Usuário ou senha incorretos.', 'error');
      }
    },
    logout() {
      this.usuarioLogado = false;
      localStorage.removeItem('usuarioLogado');
      Swal.fire('Desconectado!', 'Você saiu do sistema.', 'info');
    },
    adicionarOuAtualizarCliente() {
      if (this.novoCliente.nome.trim() === '' || this.novoCliente.email.trim() === '') {
        Swal.fire('Erro!', 'Por favor, preencha todos os campos!', 'error');
        return;
      }

      if (this.clienteEmEdicao !== null) {
        this.clientes[this.clienteEmEdicao] = { ...this.novoCliente };
        this.clienteEmEdicao = null;
        Swal.fire('Sucesso!', 'Cliente atualizado com sucesso!', 'success');
      } else {
        this.clientes.push({ ...this.novoCliente });
        Swal.fire('Sucesso!', 'Cliente adicionado com sucesso!', 'success');
      }

      this.novoCliente.nome = '';
      this.novoCliente.email = '';
      this.salvarClientes();
    },
    editarCliente(index) {
      this.novoCliente = { ...this.clientes[index] };
      this.clienteEmEdicao = index;
    },
    cancelarEdicao() {
      this.novoCliente.nome = '';
      this.novoCliente.email = '';
      this.clienteEmEdicao = null;
    },
    removerCliente(index) {
      Swal.fire({
        title: 'Tem certeza?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          this.clientes.splice(index, 1);
          this.salvarClientes();
          Swal.fire('Removido!', 'O cliente foi removido com sucesso.', 'success');
        }
      });
    },
    gerarPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text('Lista de Clientes', 10, 10);

      const headers = [['#', 'Nome', 'Email']];
      const dados = this.clientes.map((cliente, index) => [
        index + 1,
        cliente.nome,
        cliente.email,
      ]);

      doc.autoTable({
        head: headers,
        body: dados,
        startY: 20,
      });

      doc.save('clientes.pdf');
    }
  },
  mounted() {
    this.carregarClientes();
    this.usuarioLogado = localStorage.getItem('usuarioLogado') === 'true';
  }
});

app.mount('#app');
