const botaoMenu = document.getElementById('btn-menu');
const barraLateral = document.getElementById('barra-lateral');

if (botaoMenu && barraLateral) {
    botaoMenu.addEventListener('click', function(event) {
        event.stopPropagation(); 
        barraLateral.classList.toggle('active');
    });

    document.addEventListener('click', function(event) {
        if (barraLateral.classList.contains('active')) {
            const clicouDentroDaBarra = barraLateral.contains(event.target);
            const clicouNoBotao = botaoMenu.contains(event.target);
            
            if (!clicouDentroDaBarra && !clicouNoBotao) {
                barraLateral.classList.remove('active'); 
            }
        }
    });
}

const abasChecklist = document.querySelectorAll('#nav-checklist li');
abasChecklist.forEach(aba => {
    aba.addEventListener('click', function() {
        abasChecklist.forEach(item => {
            item.classList.add('letra-transparente');
            item.style.fontWeight = 'normal';
        });
        aba.classList.remove('letra-transparente');
        aba.style.fontWeight = 'bold';
    });
});

let tarefas = [
    { id: 1, texto: "Ler 20 páginas", concluida: false }
];

const listaUl = document.getElementById('lista-tarefas-ul');

function atualizarPainelProgresso() {
    const total = tarefas.length;
    const concluidas = tarefas.filter(t => t.concluida).length;
    const percentagem = total === 0 ? 0 : Math.round((concluidas / total) * 100);

    const circulo = document.getElementById('circulo-progresso');
    const h3Progresso = document.querySelector('#progresso-info h3');
    const textoFeedback = document.getElementById('progresso-feedback');

    if (circulo) circulo.textContent = `${percentagem}%`;
    if (h3Progresso) h3Progresso.textContent = `${concluidas} de ${total} tarefas`;

    if (textoFeedback) {
        if (percentagem === 0) {
            textoFeedback.textContent = "Começa com o teu primeiro passo.";
        } else if (percentagem < 100) {
            textoFeedback.textContent = "Já estás a caminhar. Continua assim!";
        } else {
            textoFeedback.textContent = "Incrível! Completaste o teu 1% de hoje.";
        }
    }
}

function renderizarTarefas() {
    if (!listaUl) return;
    listaUl.innerHTML = '';

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida;
        checkbox.id = `tarefa-${tarefa.id}`;
        
        const label = document.createElement('label');
        label.htmlFor = `tarefa-${tarefa.id}`;
        label.textContent = tarefa.texto;
        
        if (tarefa.concluida) {
            label.style.textDecoration = 'line-through';
            label.style.opacity = '0.5';
        }

        checkbox.addEventListener('change', () => {
            tarefa.concluida = checkbox.checked;
            renderizarTarefas();
            atualizarPainelProgresso();
        });

        li.appendChild(checkbox);
        li.appendChild(label);
        listaUl.appendChild(li);
    });

    const liAdicionar = document.createElement('li');
    liAdicionar.style.cursor = 'pointer';
    liAdicionar.innerHTML = '<span class="material-symbols-outlined">add</span>Adicionar um pequeno passo';
    liAdicionar.addEventListener('click', criarNovaTarefa);
    listaUl.appendChild(liAdicionar);
}

function criarNovaTarefa() {
    const texto = prompt("O que vais fazer a seguir?");
    if (texto && texto.trim() !== "") {
        tarefas.push({
            id: Date.now(),
            texto: texto.trim(),
            concluida: false
        });
        renderizarTarefas();
        atualizarPainelProgresso();
    }
}

const botaoTopoNovaTarefa = document.getElementById('topo-botao');
if (botaoTopoNovaTarefa) {
    botaoTopoNovaTarefa.addEventListener('click', criarNovaTarefa);
}

// ==================== LÓGICA DO TEMPORIZADOR MVP ====================
let cronometro;
let segundosFoco = 0;

const btnIniciarFoco = document.getElementById('temporizador-iniciar');
const btnConcluirFoco = document.getElementById('temporizador-check');
const textoTempoMinuto = document.getElementById('tempo-minuto');

// Força o botão concluir a começar escondido mal o script carrega (Garantia extra)
if (btnConcluirFoco) {
    btnConcluirFoco.classList.add('escondido');
}

if (btnIniciarFoco) {
    btnIniciarFoco.addEventListener('click', function() {
        // 1. Alternância de botões imediata
        btnIniciarFoco.classList.add('escondido');
        if (btnConcluirFoco) {
            btnConcluirFoco.classList.remove('escondido');
        }

        // 2. Inicia o contador de segundos contínuos
        cronometro = setInterval(() => {
            segundosFoco++;
            if (textoTempoMinuto) {
                // Atualiza o ecrã mantendo o número grande em destaque e a classe do teu CSS
                const minutos = Math.floor(segundosFoco / 60);
                textoTempoMinuto.innerHTML = `<span class="num-grande">${minutos}</span> minutos hoje`;
            }
        }, 1000);
    });
}

if (btnConcluirFoco) {
    btnConcluirFoco.addEventListener('click', function() {
        // 1. Para o tempo
        clearInterval(cronometro);
        
        // 2. Volta ao estado inicial de botões
        btnConcluirFoco.classList.add('escondido');
        if (btnIniciarFoco) {
            btnIniciarFoco.classList.remove('escondido');
        }
        
        // 3. Mostra o resultado do foco
        const minutosFinais = Math.floor(segundosFoco / 60);
        setTimeout(() => {
            alert(`Excelente sessão de foco! Somaste ${minutosFinais} minutos au teu dia.`);
        }, 100);
    });
}
// ====================================================================


if (btnConcluirFoco) {
    btnConcluirFoco.addEventListener('click', function() {
        // 1. Para o tempo
        clearInterval(cronometro);
        
        // 2. Volta ao estado inicial de botões
        btnConcluirFoco.classList.add('escondido');
        if (btnIniciarFoco) {
            btnIniciarFoco.classList.remove('escondido');
        }
        
        // 3. Mostra o resultado do foco
        const minutosFinais = Math.floor(segundosFoco / 60);
        setTimeout(() => {
            alert(`Excelente sessão de foco! Somaste ${minutosFinais} minutos ao teu dia.`);
        }, 100);
    });
}
// ====================================================================

const formulario = document.querySelector('form');
if (formulario) {
    formulario.addEventListener('submit', function(event) {
        const senha = document.getElementById('isenha');
        const confirmaSenha = document.getElementById('icsenha');

        if (senha && confirmaSenha && senha.value !== confirmaSenha.value) {
            event.preventDefault();
            alert("As senhas inseridas não são iguais! Por favor, verifica os campos.");
            return;
        }

        const email = document.getElementById('iemail');
        if (email && !email.value.includes('@')) {
            event.preventDefault();
            alert("Por favor, insere um endereço de email válido.");
            return;
        }
    });
}

renderizarTarefas();
atualizarPainelProgresso();
