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

let cronometro;
let segundosFoco = 0;
let emFoco = false;

const btnIniciarFoco = document.getElementById('temporizador-iniciar');
const btnConcluirFoco = document.getElementById('temporizador-check');
const textoTempoMinuto = document.getElementById('tempo-minuto');

function formatarTempo(segundosTotais) {
    const minutos = Math.floor(segundosTotais / 60);
    return `${minutos} minutos hoje`;
}

if (btnIniciarFoco) {
    btnIniciarFoco.addEventListener('click', function() {
        emFoco = !emFoco;

        if (emFoco) {
            btnIniciarFoco.innerHTML = '<span class="material-symbols-outlined">pause</span> Pausar Foco';
            btnIniciarFoco.style.backgroundColor = '#e11d48';
            btnIniciarFoco.style.color = '#ffffff';

            cronometro = setInterval(() => {
                segundosFoco++;
                if (textoTempoMinuto) {
                    textoTempoMinuto.innerHTML = `<span class="num-grande">${Math.floor(segundosFoco / 60)}</span> minutos hoje`;
                }
            }, 1000);
        } else {
            clearInterval(cronometro);
            btnIniciarFoco.innerHTML = '<span class="material-symbols-outlined">play_arrow</span> Iniciar Foco';
            btnIniciarFoco.style.backgroundColor = 'var(--texto-verde)';
            btnIniciarFoco.style.color = 'var(--background)';
        }
    });
}

if (btnConcluirFoco) {
    btnConcluirFoco.addEventListener('click', function() {
        clearInterval(cronometro);
        emFoco = false;
        if (btnIniciarFoco) {
            btnIniciarFoco.innerHTML = '<span class="material-symbols-outlined">play_arrow</span> Iniciar Foco';
            btnIniciarFoco.style.backgroundColor = 'var(--texto-verde)';
            btnIniciarFoco.style.color = 'var(--background)';
        }
        alert(`Excelente sessão de foco! Somaste ${Math.floor(segundosFoco / 60)} minutos ao teu dia.`);
    });
}

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
