# Guia de Contexto Modular (Arquivos Dormindo)

Para manter a IA rápida e evitar travamentos, **NÃO** envie todos os arquivos do projeto. Use este guia para saber o que enviar baseada na tarefa.

## 1. O Núcleo (Sempre Enviar)
Estes arquivos são essenciais para a IA entender a estrutura básica.
*   `App.tsx`
*   `types.ts`
*   `ROADMAP.md`

---

## 2. Cenários de Tarefa

### 🅰️ Cenário: Criar um Novo App
Envie apenas o Núcleo e:
*   `data/internal_tools.ts` (Para registrar o novo app)
*   *Solicite à IA para criar a estrutura de pastas do novo app.*

### 🅱️ Cenário: Trabalhar no "Kit Freelancer"
Envie o Núcleo e a pasta do app:
*   `components/apps/kit-freelancer_v1/**`
*   **NÃO ENVIE:** `components/apps/Media-Tools-v1/**` ou `finan-control`.

### 🆎 Cenário: Trabalhar no "Media Tools"
Envie o Núcleo e a pasta do app:
*   `components/apps/Media-Tools-v1/**`
*   **NÃO ENVIE:** `components/apps/kit-freelancer_v1/**`.

### 🎨 Cenário: Ajustes Visuais Globais (Landing Page)
Envie o Núcleo e:
*   `components/HomePage.tsx`
*   `components/Header.tsx`
*   `components/Footer.tsx`
*   `index.css`

---

## 3. Regra de Ouro
Se um arquivo não será alterado e não é necessário para entender a lógica da tarefa atual, deixe-o **"dormindo"** (não copie seu conteúdo para o prompt). A IA assumirá que ele existe e funciona corretamente.
