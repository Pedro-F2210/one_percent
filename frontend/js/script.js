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

        // ATUALIZAÇÃO: Define o filtro ativo com base no texto do botão e redesenha a lista
        const textoAba = aba.textContent.trim();
        if (textoAba.includes("Todas")) filtroAtivo = "Todas";
        else if (textoAba.includes("Pendentes")) filtroAtivo = "Pendentes";
        else if (textoAba.includes("Concluídas")) filtroAtivo = "Concluídas";

        renderizarTarefas(); // Redesenha a lista aplicando o filtro escolhido
    });
});


let tarefas = [
    { id: 1, texto: "Ler 20 páginas", concluida: false }
];
let filtroAtivo = "Todas";

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

    const pendentes = total - concluidas;

    const spanTodas = document.getElementById('contador-todas');
    const spanPendentes = document.getElementById('contador-pendentes');
    const spanConcluidas = document.getElementById('contador-concluidas');

    if (spanTodas) spanTodas.textContent = total;
    if (spanPendentes) spanPendentes.textContent = pendentes;
    if (spanConcluidas) spanConcluidas.textContent = concluidas;
}

function renderizarTarefas() {
    if (!listaUl) return;
    listaUl.innerHTML = '';

    // ATUALIZAÇÃO: Filtra as tarefas antes de as mostrar no ecrã
    let tarefasFiltradas = tarefas;
    if (filtroAtivo === "Pendentes") {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    } else if (filtroAtivo === "Concluídas") {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    // Agora usamos a lista 'tarefasFiltradas' para desenhar no ecrã
    tarefasFiltradas.forEach(tarefa => {
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

    // Mantém o botão de adicionar sempre visível no final da lista
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
let segundosFoco = 1500;

function formatarCronometro(segundosTotais) {
    const minutos = Math.floor(segundosTotais / 60);
    const segundos = segundosTotais % 60;
    
    const minutosFormatados = minutos < 10 ? `0${minutos}` : minutos;
    const segundosFormatados = segundos < 10 ? `0${segundos}` : segundos;
    
    return `<span class="material-symbols-outlined">timer</span> <span class="num-grande">${minutosFormatados}:${segundosFormatados}</span>`;
}

const btnIniciarFoco = document.getElementById('temporizador-iniciar');
const btnConcluirFoco = document.getElementById('temporizador-check');
const textoTempoMinuto = document.getElementById('tempo-minuto');

// Força o botão concluir a começar escondido mal o script carrega (Garantia extra)
// Força o botão concluir a começar escondido mal o script carrega
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

        // 2. Inicia o contador decrescente
        cronometro = setInterval(() => {
            if (segundosFoco > 0) {
                segundosFoco--; // Diminui 1 segundo
                if (textoTempoMinuto) {
                    textoTempoMinuto.innerHTML = formatarCronometro(segundosFoco);
                }
            } else {
                // O tempo chegou a zero! Termina a sessão automaticamente
                clearInterval(cronometro);
                btnConcluirFoco.click(); 
            }
        }, 1000);
    });
}

if (btnConcluirFoco) {
    btnConcluirFoco.addEventListener('click', function() {
        // 1. Para o tempo
        clearInterval(cronometro);
        
        // 2. Calcula quantos minutos o utilizador completou de verdade
        const segundosPassados = 1500 - segundosFoco;
        const minutosCompletos = Math.floor(segundosPassados / 60);
        
        // 3. Volta ao estado inicial de botões e faz reset do tempo
        btnConcluirFoco.classList.add('escondido');
        if (btnIniciarFoco) {
            btnIniciarFoco.classList.remove('escondido');
        }
        
        // Faz reset do cronómetro de volta para os 25:00 no ecrã
        segundosFoco = 1500;
        if (textoTempoMinuto) {
            textoTempoMinuto.innerHTML = formatarCronometro(segundosFoco);
        }
        
        // 4. Mostra o resultado do foco
        setTimeout(() => {
            alert(`Excelente sessão de foco! Dedicaste ${minutosCompletos} minutos ao teu objetivo.`);
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
