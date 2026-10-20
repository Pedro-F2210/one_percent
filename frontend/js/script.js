const botaoMenu = document.getElementById('btn-menu');
const barraLateral = document.getElementById('barra-lateral');

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