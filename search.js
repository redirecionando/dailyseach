// Dados de exemplo para demonstração
const sampleArticles = [
    {
        id: 1,
        title: "10 destinos turísticos que serão tendência em 2025",
        excerpt: "Descubra os lugares que estarão em alta no próximo ano para planejar suas próximas férias.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.",
        category: "Entretenimento",
        date: "02 Mar 2025",
        thumbnail: "/api/placeholder/400/250"
    },
    {
        id: 2,
        title: "Receitas simples e saudáveis para o dia a dia",
        excerpt: "Aprenda a preparar refeições nutritivas em menos de 30 minutos para uma rotina mais saudável.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.",
        category: "Viral",
        date: "01 Mar 2025",
        thumbnail: "/api/placeholder/400/250"
    },
    {
        id: 3,
        title: "Os melhores filmes e séries lançados no último mês",
        excerpt: "Confira nossa seleção com as produções mais interessantes que chegaram às plataformas de streaming.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.",
        category: "Entretenimento",
        date: "28 Fev 2025",
        thumbnail: "/api/placeholder/400/250"
    },
    {
        id: 4,
        title: "Avanços tecnológicos que devem mudar o mundo até 2030",
        excerpt: "Cientistas preveem quais inovações vão transformar radicalmente nossa forma de viver nos próximos anos.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.",
        category: "Notícias",
        date: "27 Fev 2025",
        thumbnail: "/api/placeholder/400/250"
    },
    {
        id: 5,
        title: "Dicas para melhorar seu bem-estar mental no trabalho",
        excerpt: "Especialistas compartilham estratégias para reduzir o estresse e aumentar a produtividade no ambiente corporativo.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.",
        category: "Viral",
        date: "26 Fev 2025",
        thumbnail: "/api/placeholder/400/250"
    },
    {
        id: 6,
        title: "Retrospectiva dos maiores eventos esportivos do ano",
        excerpt: "Relembre os momentos mais marcantes do esporte mundial em 2024 e início de 2025.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.",
        category: "Notícias",
        date: "25 Fev 2025",
        thumbnail: "/api/placeholder/400/250"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchPage = document.getElementById('searchPage');
    const featuredPosts = document.querySelector('.featured-posts');
    const searchQuery = document.getElementById('searchQuery');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchPagination = document.getElementById('searchPagination');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let currentFilter = 'all';
    let currentPage = 1;
    const resultsPerPage = 5;
    let currentSearchResults = [];
    
    // Debounce para evitar muitas requisições
    let timeout = null;
    
    // Quando o usuário digita na caixa de pesquisa
    searchInput.addEventListener('input', function() {
        clearTimeout(timeout);
        
        timeout = setTimeout(function() {
            const query = searchInput.value.trim();
            
            if (query.length > 2) {
                performDropdownSearch(query);
            } else {
                searchResults.innerHTML = '';
                searchResults.classList.remove('active');
            }
        }, 300);
    });
    
    // Quando o formulário de pesquisa é enviado
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (query.length > 0) {
            performPageSearch(query);
        }
    });
    
    // Quando o usuário clica fora dos resultados da pesquisa
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.classList.remove('active');
        }
    });
    
    // Configurar filtros de categoria
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            currentPage = 1;
            filterAndDisplayResults();
        });
    });
    
    // Pesquisa para o dropdown de resultados
    function performDropdownSearch(query) {
        // Em um sistema real, isso seria uma chamada AJAX
        const results = searchInData(query);
        
        if (results.length > 0) {
            displayDropdownResults(results.slice(0, 5)); // Mostrar apenas 5 resultados no dropdown
            searchResults.classList.add('active');
        } else {
            searchResults.innerHTML = '<p class="no-results">Nenhum resultado encontrado</p>';
            searchResults.classList.add('active');
        }
    }
    
    // Pesquisa para a página completa de resultados
    function performPageSearch(query) {
        // Em um sistema real, isso seria uma chamada AJAX
        const results = searchInData(query);
        
        // Esconder a seção de destaques e mostrar a página de pesquisa
        featuredPosts.style.display = 'none';
        searchPage.style.display = 'block';
        
        // Atualizar o termo de pesquisa exibido
        searchQuery.textContent = `"${query}"`;
        
        // Salvar os resultados para filtrar depois
        currentSearchResults = results;
        currentPage = 1;
        
        // Resetar o filtro para "Todos"
        currentFilter = 'all';
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Exibir os resultados
        filterAndDisplayResults();
        
        // Esconder o dropdown de resultados
        searchResults.classList.remove('active');
    }
    
    // Filtrar e exibir resultados na página de pesquisa
    function filterAndDisplayResults() {
        let filteredResults = currentSearchResults;
        
        // Aplicar filtro de categoria se não for "Todos"
        if (currentFilter !== 'all') {
            filteredResults = currentSearchResults.filter(item => item.category === currentFilter);
        }
        
        // Calcular paginação
        const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = Math.min(startIndex + resultsPerPage, filteredResults.length);
        const paginatedResults = filteredResults.slice(startIndex, endIndex);
        
        // Exibir resultados
        displayPageResults(paginatedResults, filteredResults.length);
        
        // Exibir paginação
        displayPagination(totalPages);
    }
    
    // Exibir resultados no dropdown
    function displayDropdownResults(results) {
        searchResults.innerHTML = '';
        
        const resultList = document.createElement('ul');
        resultList.className = 'search-results-list';
        
        results.forEach(item => {
            const resultItem = document.createElement('li');
            
            resultItem.innerHTML = `
                <a href="#" class="result-item" data-id="${item.id}">
                    <div class="result-thumb">
                        <img src="${item.thumbnail}" alt="${item.title}">
                    </div>
                    <div class="result-info">
                        <h3>${item.title}</h3>
                        <p>${item.excerpt}</p>
                        <span class="result-category">${item.category}</span>
                    </div>
                </a>
            `;
            
            resultList.appendChild(resultItem);
        });
        
        searchResults.appendChild(resultList);
        
        // Adicionar eventos de clique para os itens
        const resultItems = document.querySelectorAll('.result-item');
        resultItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                // Em um sistema real, isso redirecionaria para a página do artigo
                alert('Redirecionando para o artigo: ' + this.querySelector('h3').textContent);
            });
        });
    }
    
    // Exibir resultados na página de pesquisa
    function displayPageResults(results, totalResults) {
        searchResultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContainer.innerHTML = '<p class="no-results">Nenhum resultado encontrado para os filtros selecionados.</p>';
            return;
        }
        
        results.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            resultItem.innerHTML = `
                <div class="search-result-thumb">
                    <img src="${item.thumbnail}" alt="${item.title}">
                </div>
                <div class="search-result-content">
                    <span class="category">${item.category}</span>
                    <h3><a href="#" data-id="${item.id}">${item.title}</a></h3>
                    <p>${item.excerpt}</p>
                    <div class="search-meta">
                        <span class="date">${item.date}</span>
                        <span class="read-more"><a href="#" data-id="${item.id}">Ler mais</a></span>
                    </div>
                </div>
            `;
            
            searchResultsContainer.appendChild(resultItem);
        });
        
        // Adicionar eventos de clique para os links
        const articleLinks = searchResultsContainer.querySelectorAll('a[data-id]');
        articleLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                // Em um sistema real, isso redirecionaria para a página do artigo
                alert('Redirecionando para o artigo ID: ' + this.dataset.id);
            });
        });
    }
    
    // Exibir a paginação
    function displayPagination(totalPages) {
        searchPagination.innerHTML = '';
        
        if (totalPages <= 1) {
            return;
        }
        
        // Botão anterior
        const prevButton = document.createElement('button');
        prevButton.innerHTML = '&lt;';
        prevButton.className = currentPage === 1 ? 'disabled' : '';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                filterAndDisplayResults();
                window.scrollTo(0, searchPage.offsetTop - 20);
            }
        });
        searchPagination.appendChild(prevButton);
        
        // Botões de páginas
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? 'active' : '';
            pageButton.addEventListener('click', function() {
                currentPage = i;
                filterAndDisplayResults();
                window.scrollTo(0, searchPage.offsetTop - 20);
            });
            searchPagination.appendChild(pageButton);
        }
        
        // Botão próximo
        const nextButton = document.createElement('button');
        nextButton.innerHTML = '&gt;';
        nextButton.className = currentPage === totalPages ? 'disabled' : '';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                filterAndDisplayResults();
                window.scrollTo(0, searchPage.offsetTop - 20);
            }
        });
        searchPagination.appendChild(nextButton);
    }
    
    // Função de pesquisa nos dados
    function searchInData(query) {
        query = query.toLowerCase();
        return sampleArticles.filter(item => {
            return item.title.toLowerCase().includes(query) || 
                   item.excerpt.toLowerCase().includes(query) || 
                   item.content.toLowerCase().includes(query) ||
                   item.category.toLowerCase().includes(query);
        });
    }

    // Adiciona eventos para os cartões na página inicial
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Em um sistema real, isso redirecionaria para a página do artigo
            alert('Redirecionando para o artigo: ' + this.querySelector('h3').textContent);
        });
    });
});
