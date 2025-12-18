# Manual de Arquitetura de Banco de Dados - Arsenal Tools

Este documento serve como o guia oficial para o desenvolvimento de novos aplicativos dentro do ecossistema Arsenal Tools.

Utilizamos uma arquitetura **Multi-Schema** em um único banco de dados Supabase. Isso permite compartilhar a autenticação de usuários entre todos os apps, mantendo os dados de cada ferramenta isolados e organizados.

---

## 1. Visão Geral da Arquitetura

O banco de dados é dividido em "namespaces" (schemas):

1.  **`public`**: Reservado exclusivamente para a **Landing Page Principal** (este projeto). Contém o catálogo de ferramentas, leads globais e configurações do site.
2.  **`auth`**: Gerenciado automaticamente pelo Supabase para usuários e sessões.
3.  **`app_[nome_da_ferramenta]`**: Schemas isolados para cada aplicativo.

### Por que essa estrutura?
*   **Organização:** As tabelas do "Finan Control" não se misturam com as do "Semear Bíblia".
*   **Segurança:** Se um app tiver uma falha de segurança, ele não compromete os dados dos outros.
*   **Login Único (SSO):** Um usuário criado na Landing Page pode fazer login em qualquer ferramenta sem precisar criar outra conta.

---

## 2. Namespaces Reservados

O script mestre (`supabase_setup_master.md`) já criou os seguintes schemas vazios, prontos para uso:

### Apps Freemium
*   `app_semear_biblia`
*   `app_kit_freelancer`
*   `app_background_master`
*   `app_finan_control`
*   `app_ops_aqui_design`
*   `app_freemium` (Genérico para ferramentas menores)

### Apps Premium
*   `app_weblp`
*   `app_cms_page_builder`
*   `app_buscador_tendencias`
*   `app_codemaster_ai`
*   `app_genesis_generator`
*   `app_lingo_leap`
*   `app_alpha_geminy`
*   `app_brandup_face`
*   `app_workflow_usa`
*   `app_payowl`
*   `app_reelpulse`
*   `app_uperbolt`
*   `app_b3tmoney`
*   `app_premium` (Genérico para ferramentas menores)

---

## 3. Como Desenvolver uma Nova Ferramenta

Quando você for criar, por exemplo, o **Finan Control**, você **NÃO** deve criar tabelas no schema `public`. Você deve usar o schema `app_finan_control`.

### Exemplo Prático: Criando tabelas para o Finan Control

No SQL Editor do Supabase, você executaria:

```sql
-- Criando uma tabela de Transações DENTRO do schema do app
CREATE TABLE app_finan_control.transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID REFERENCES auth.users(id) NOT NULL, -- Vincula ao usuário logado
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitando segurança (RLS)
ALTER TABLE app_finan_control.transactions ENABLE ROW LEVEL SECURITY;

-- Criando política: Usuário só vê suas próprias transações
CREATE POLICY "Usuário vê apenas suas transações" 
ON app_finan_control.transactions
FOR ALL
USING (auth.uid() = user_id);
```

### Como acessar no Frontend (Código React)

No código do app Finan Control, ao inicializar o cliente Supabase ou fazer queries, você especifica o schema:

```typescript
// Exemplo de query buscando dados do schema específico
const { data, error } = await supabase
  .schema('app_finan_control') // <--- IMPORTANTE: Define o schema
  .from('transactions')
  .select('*');
```

---

## 4. Boas Práticas

1.  **Nunca altere o schema `public`** ao desenvolver um sub-app. O `public` é exclusivo da Landing Page.
2.  **Use chaves estrangeiras para `auth.users`**: Sempre vincule os dados ao ID do usuário para garantir que cada um veja apenas o que é seu.
3.  **Prefixos são seus amigos**: Se precisar criar uma tabela auxiliar ou função, mantenha-a dentro do schema do app.

---

Este guia garante que o ecossistema Arsenal Tools cresça de forma sustentável, segura e organizada.
