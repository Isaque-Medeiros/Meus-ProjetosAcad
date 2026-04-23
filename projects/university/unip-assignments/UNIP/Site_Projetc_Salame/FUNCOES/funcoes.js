// Aguarda o documento carregar completamente
document.addEventListener("DOMContentLoaded", () => {
    
    // Seleciona todos os elementos com a classe 'fade-in'
    const elementosParaAnimar = document.querySelectorAll('.fade-in');

    // Define a opacidade inicial para 0 e adiciona transição
    elementosParaAnimar.forEach(elemento => {
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateY(20px)';
        elemento.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    });

    // Anima os elementos logo após um pequeno delay
    setTimeout(() => {
        elementosParaAnimar.forEach((elemento, index) => {
            setTimeout(() => {
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, index * 300); // Cria um efeito cascata
        });
    }, 100);
});

// ... (mantenha o código anterior do fade-in)

document.addEventListener("click", (e) => {
    if (e.target.classList.contains('btn-comprar-item') || e.target.classList.contains('stylebutton')) {
        // Simula um impacto de luta ao clicar
        e.target.style.transform = "scale(0.9)";
        setTimeout(() => {
            e.target.style.transform = "scale(1)";
        }, 100);
    }
}); 