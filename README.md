# 2ZWatch Client

[![Angular](https://img.shields.io/badge/Angular-20.2.0-DD0031?logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap)](https://getbootstrap.com/)

## Sobre o Projeto

Cliente web desenvolvido em Angular para a plataforma 2ZWatch - uma aplicação moderna de streaming e descoberta de filmes e séries. A aplicação oferece uma interface intuitiva e responsiva para explorar, avaliar e gerenciar listas personalizadas de conteúdo audiovisual.

## Funcionalidades

### Autenticação e Autorização
- Login e registro de usuários
- Autenticação OAuth 2.0 com Google
- Gerenciamento de sessão com JWT
- Guards de rota para proteção de conteúdo
- Interceptor HTTP para autenticação automática

### Exploração de Conteúdo
- Navegação por filmes e séries populares
- Sistema de busca avançada
- Filtros por gênero, ano e avaliação
- Páginas de detalhes completas
- Visualização de trailers e informações técnicas

### Perfil de Usuário
- Perfil personalizado com avatar
- Histórico de atividades
- Estatísticas de visualização
- Gerenciamento de preferências

### Recursos Interativos
- Sistema de avaliação (rating)
- Lista de favoritos
- Watchlist (lista para assistir depois)
- Sistema de comentários
- Feed comunitário

### Interface
- Design responsivo e moderno
- Suporte a temas
- Loading states com skeleton screens
- Tratamento de erros amigável
- Animações suaves

## Arquitetura

O projeto segue as melhores práticas do Angular, utilizando uma arquitetura modular e escalável:

```
src/
├── app/
│   ├── core/                    # Serviços singleton e funcionalidades essenciais
│   │   ├── guards/             # Route guards
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── models/             # Modelos de dados principais
│   │   └── services/           # Serviços core (API, Auth, Cache)
│   │
│   ├── features/               # Módulos de funcionalidades
│   │   ├── account/           # Gerenciamento de conta
│   │   ├── movies/            # Funcionalidades de filmes
│   │   ├── series/            # Funcionalidades de séries
│   │   └── taxonomy/          # Categorização e filtros
│   │
│   ├── layout/                # Componentes de layout
│   │   ├── header/           # Cabeçalho e navegação
│   │   ├── footer/           # Rodapé
│   │   ├── sidebar/          # Menu lateral
│   │   └── main-layout/      # Layout principal
│   │
│   ├── pages/                # Páginas principais
│   │   ├── home/            # Página inicial
│   │   ├── explorer/        # Explorador de conteúdo
│   │   ├── details/         # Detalhes de filme/série
│   │   ├── login/           # Autenticação
│   │   ├── register/        # Cadastro
│   │   └── user-profile/    # Perfil do usuário
│   │
│   └── shared/              # Componentes e recursos compartilhados
│       ├── components/      # Componentes reutilizáveis
│       ├── directives/      # Diretivas customizadas
│       ├── pipes/          # Pipes customizados
│       ├── models/         # Modelos compartilhados
│       └── validators/     # Validadores de formulário
│
├── assets/                 # Recursos estáticos
├── environments/          # Configurações de ambiente
└── styles/               # Estilos globais
```

## Tecnologias Utilizadas

### Core
- **Angular 20.2.0** - Framework principal
- **TypeScript 5.9.2** - Linguagem de programação
- **RxJS 7.8.0** - Programação reativa

### UI/UX
- **Bootstrap 5.3.8** - Framework CSS
- **Popper.js 2.11.8** - Tooltips e popovers
- **CSS3** - Estilização customizada

### Ferramentas de Desenvolvimento
- **Angular CLI 20.2.2** - Ferramenta de linha de comando
- **Jasmine & Karma** - Framework de testes
- **Prettier** - Formatação de código

### Pré-requisitos

```bash
Node.js >= 18.x
npm >= 10.x
```

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd 2ZWatch/client
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie o arquivo src/environments/environment.ts
```

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID'
};
```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

5. Acesse a aplicação em `http://localhost:4200`

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila a aplicação para produção |
| `npm run watch` | Compila em modo watch para desenvolvimento |
| `npm test` | Executa os testes unitários |
| `npm run test:coverage` | Executa testes com cobertura de código |

## Configuração

### Ambiente de Desenvolvimento

Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/'
};
```

### Ambiente de Produção

Edite `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api',
  googleClientId: 'YOUR_PRODUCTION_GOOGLE_CLIENT_ID',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/'
};
```

## Testes

O projeto utiliza Jasmine e Karma para testes unitários:

```bash
# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm test -- --watch
```

## Build

Para compilar a aplicação para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados no diretório `dist/`.

### Build Otimizado

```bash
npm run build -- --configuration production
```

Recursos de otimização incluídos:
- Minificação de código
- Tree shaking
- AOT (Ahead-of-Time) compilation
- Lazy loading de módulos
- Service Worker (se configurado)

## Padrões de Código

O projeto segue o Angular Style Guide e utiliza Prettier para formatação:

```json
{
  "printWidth": 100,
  "singleQuote": true,
  "overrides": [
    {
      "files": "*.html",
      "options": {
        "parser": "angular"
      }
    }
  ]
}
```

## Segurança

### Práticas Implementadas

- Autenticação JWT com renovação automática
- HTTP-only cookies para tokens sensíveis
- Guards de rota para proteção de páginas
- Sanitização de inputs
- Proteção contra XSS
- CORS configurado corretamente
- Validação de formulários no client e server

## Internacionalização

O projeto está configurado para português brasileiro (pt-BR), mas pode ser facilmente expandido para outros idiomas.

## Responsividade

A aplicação é totalmente responsiva e otimizada para:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)
- Large screens (1920px+)

## Performance

### Otimizações Implementadas

- Lazy loading de módulos
- Cache de requisições HTTP
- Virtual scrolling em listas longas
- Skeleton screens durante carregamento
- Debounce em buscas
- Image lazy loading
- OnPush change detection strategy

## Autor

Desenvolvido por Osvaldo Vasconcelos de Carvalho

**Nota**: Certas partes do projeto como emails, redes do site ou contato estão sem funcionalidade real.
