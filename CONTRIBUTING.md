# 🤝 Guia de Contribuição - Arsenal Tools

Bem-vindo! Este guia define as diretrizes para contribuir com o projeto Arsenal Tools. Segui-las nos ajuda a manter a qualidade, consistência e legibilidade do código.

## 🚀 Começando

1.  **Instale as dependências:**
    ```bash
    npm install
    ```
2.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## 🌳 Estratégia de Branches

Usamos um modelo simples baseado no Git Flow:

*   **`main`**: Branch de produção. Apenas código estável e testado.
*   **`develop`**: Branch de integração. Novas features são mescladas aqui antes de irem para a `main`.
*   **`feature/[nome-da-tarefa]`**: Crie a partir da `develop` para novas funcionalidades (ex: `feature/add-image-watermark`).
*   **`fix/[nome-do-bug]`**: Crie a partir da `develop` para correções de bugs (ex: `fix/login-modal-alignment`).

## ✍️ Mensagens de Commit

Adotamos o padrão **Conventional Commits**. Isso nos ajuda a gerar changelogs e a entender o histórico de mudanças de forma clara.

**Formato:** `<tipo>(<escopo>): <assunto>`

*   **`feat`**: Uma nova funcionalidade (ex: `feat(media-tools): Add lazy loading to images`).
*   **`fix`**: Correção de um bug (ex: `fix(auth): Correct password validation`).
*   **`refactor`**: Mudança no código que não altera a funcionalidade (ex: `refactor(ui): Extract Button component`).
*   **`docs`**: Alterações na documentação (ex: `docs: Update CONTRIBUTING.md`).
*   **`style`**: Mudanças de formatação que não afetam o código (ex: `style: Apply prettier formatting`).
*   **`chore`**: Tarefas de manutenção, build, etc. (ex: `chore: Upgrade vite dependency`).

## 🎨 Estilo de Código e Convenções

### Linguagem e Framework
*   **TypeScript**: Use tipos sempre que possível.
*   **React**: Utilize componentes funcionais e Hooks.
*   **Estilo**: Use **Tailwind CSS** para estilização. Evite arquivos `.css` customizados.

### Nomenclatura de Arquivos
*   **Componentes**: `PascalCase` (ex: `MyComponent.tsx`).
*   **Hooks e Utilitários**: `camelCase` (ex: `useFormPersistence.ts`).

### Estrutura de Componentes
*   **Componentes Pequenos**: Mantenha-os focados em uma única responsabilidade.
*   **`React.memo`**: Use para componentes que renderizam com frequência com as mesmas props.
*   **Hooks Customizados**: Extraia lógicas complexas e de estado para hooks (`use...`) para reutilização e clareza.

### Imports
*   **Ordem**:
    1.  `react` e `react-dom`.
    2.  Bibliotecas externas (ex: `@supabase/supabase-js`).
    3.  Imports internos com path absoluto (`@/components/...`).
    4.  Imports relativos (`../...`).
*   **Caminhos**: Use paths absolutos com o alias `@/` sempre que possível.

### Gerenciamento de Estado
*   Use `React.Context` para estado global ou compartilhado entre muitos componentes.
*   Evite prop-drilling. Se um prop passa por mais de 2 níveis, considere usar Context.

### Acessibilidade (a11y)
*   Use HTML semântico (`<button>`, `<nav>`, etc.).
*   Todos os elementos interativos devem ser acessíveis pelo teclado.
*   Use atributos ARIA (`aria-label`, `role`, etc.) quando necessário.

### Internacionalização (i18n)
*   **NÃO** use strings "hardcoded" na UI.
*   Adicione todos os textos visíveis ao usuário nos arquivos de tradução em `locales/**`.
*   Acesse os textos através do hook `useLanguage` ou `useTranslation`.

### Comentários
*   Use JSDoc para documentar props de componentes complexos, hooks e funções utilitárias.
*   Comente apenas lógicas complexas que não são autoexplicativas.

## 🔄 Processo de Pull Request (PR)

1.  **Crie seu PR** a partir da sua branch `feature/...` ou `fix/...` para a `develop`.
2.  **Título e Descrição**: Use um título claro (seguindo Conventional Commits) e uma descrição detalhada do que foi feito.
3.  **Vincule a uma Tarefa**: Se houver uma issue ou tarefa no Trello/Jira, vincule-a ao PR.
4.  **Revisão**: Peça a revisão de pelo menos um outro membro da equipe.
5.  **Merge**: Após a aprovação, o autor do PR pode fazer o "squash and merge" para a `develop`.

---

Obrigado por contribuir para tornar o Arsenal Tools incrível! 🎉