# Arsenal Tools Landing Page

Uma Landing Page de alta conversão para ferramentas digitais, apresentando níveis Freemium e Premium. Inclui alternância de tema claro/escuro, suporte a i18n (Português/Inglês) e um painel administrativo completo.

## 🚀 Funcionalidades

- **Catálogo de Ferramentas:** Exibição de ferramentas freemium e premium.
- **Captura de Leads:** Modais para captura de interesse em ferramentas premium.
- **Painel Administrativo:**
  - Gerenciamento de Ferramentas (CRUD).
  - Gerenciamento de Leads (Status, Anotações).
  - Edição de Conteúdo do Site (Textos, Logo).
  - Métricas e Gráficos.
- **Temas:** Suporte a Dark Mode e Light Mode.
- **Internacionalização:** Suporte a PT-BR e EN.

## 🛠️ Tecnologias

- React 18
- TypeScript
- Tailwind CSS
- Supabase (Atualmente rodando com Mock/Stub local para desenvolvimento)
- Vite

## 📦 Instalação e Uso

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/arsenal-tools.git
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🗄️ Banco de Dados (Supabase vs Mock)

Atualmente, o projeto está configurado no modo **STUB (Mock)**. Isso significa que ele **não** se conecta a um banco de dados Supabase real por padrão, mas sim simula as operações usando o `sessionStorage` do navegador. Isso permite testar todas as funcionalidades (CRUD, Auth Admin, etc.) sem precisar de chaves de API.

### Como Migrar para Produção (Supabase Real)

Para conectar ao Supabase real na Vercel:

1.  Crie um projeto no [Supabase](https://supabase.com/).
2.  Rode os scripts SQL fornecidos na pasta `sql/` (ou `supabase_all_apps.md`) no SQL Editor do Supabase para criar as tabelas.
3.  No arquivo `supabaseClient.ts`, altere a configuração `isStub` para `false` ou condicione-a a variáveis de ambiente.
4.  Configure as variáveis de ambiente no seu arquivo `.env` ou no painel da Vercel:
    ```
    VITE_SUPABASE_URL=sua_url_do_supabase
    VITE_SUPABASE_ANON_KEY=sua_chave_anonima
    ```

## 👤 Autor

**Fabio Rodrigues**
