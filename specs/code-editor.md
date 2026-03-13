# Especificação: Editor de Código com Syntax Highlighting

Este documento detalha o estudo e a especificação para a implementação de um editor de código interativo para o DevRoast, inspirado no [ray.so](https://ray.so).

## Conclusão dos Estudos

### Referência: ray.so
O editor do `ray.so` utiliza uma abordagem de "Overlay":
- **Input**: Um `<textarea>` transparente que captura o input do usuário e eventos de teclado.
- **Visual**: Um componente de renderização (`HighlightedCode`) posicionado atrás do textarea que usa **Shiki** para transformar o código em HTML realçado.
- **Detecção**: Utiliza `highlight.js` (`highlightAuto`) para detectar a linguagem baseada no conteúdo quando o usuário cola ou digita código.
- **Vantagem**: Extremamente leve e visualmente idêntico ao código final.
- **Desvantagem**: Requer implementação manual de comportamentos básicos de editor (Tab, Indentação, Fechamento de parênteses/chaves).

### Proposta para DevRoast: CodeMirror 6 + Shiki
Embora a abordagem do `ray.so` seja funcional, para o DevRoast, onde o foco é o "roasting" e possivelmente edições mais complexas, recomendamos o uso do **CodeMirror 6 (CM6)** com integração **Shiki**.

**Por que CodeMirror 6?**
1. **Robustez**: Suporta nativamente multi-cursor, desfazer/refazer (Undo/Redo), indentação inteligente e acessibilidade.
2. **Modularidade**: CM6 é totalmente modular; podemos incluir apenas o necessário para manter o pacote leve.
3. **Performance**: Otimizado para lidar com arquivos maiores e renderização eficiente.
4. **Integração Shiki**: Podemos usar o Shiki para o realce de sintaxe dentro do CodeMirror, mantendo a consistência visual com o componente `CodeBlock` já existente no projeto.

---

## Especificação Técnica

### 1. Tecnologias
- **Editor Core**: `@codemirror/view`, `@codemirror/state`.
- **Syntax Highlighting**: `shiki` (já integrado no projeto).
- **Detecção de Linguagem**: `highlight.js` (apenas a função de detecção para manter o bundle pequeno).
- **Estilização**: Tailwind CSS 4.0 (tokens `@theme`).
- **Formatação**: **Biome** (para JS/TS/JSON/CSS) e fallback para Prettier se necessário.

### 2. Funcionalidades Principais
- **Auto-Detecção**: Ao colar (`onPaste`) ou após um delay no input, o editor deve sugerir ou trocar automaticamente a linguagem.
- **Seleção Manual**: Um dropdown (usando o padrão de componentes da UI) para trocar a linguagem manualmente.
- **Sincronização com Tema**: O editor deve usar o tema `vesper` (ou variantes configuráveis no `globals.css`) para manter a estética do projeto.
- **Comportamento IDE**: Suporte a Tab (2 espaços), Auto-indentação ao dar Enter, e fechamento de brackets.

### 3. Estrutura de Componentes
- `CodeEditor`: Componente principal (Client Component).
- `LanguageSelector`: Dropdown para escolha manual da linguagem.
- `EditorToolbar`: Barra de ferramentas com botões de ação (Copiar, Formatar, Trocar Linguagem).

---

## Decisões de Projeto

1. **Persistência**: O código será persistido no `localStorage` para garantir que o usuário não perca o trabalho ao navegar entre páginas ou recarregar o browser.
2. **Números de Linhas**: O editor exibirá números de linhas por padrão, facilitando a referência durante o "roasting".
3. **Formatação Automática**: Ao colar um trecho de código, o editor disparará automaticamente a formatação (usando Biome/Prettier) além da detecção de linguagem.
4. **Limites**: Não haverá limite artificial de caracteres ou linhas nesta fase inicial.

---

## To-dos para Implementação

- [ ] Instalar dependências necessárias (`@codemirror/view`, `@codemirror/state`, `highlight.js`).
- [ ] Criar utilitário `detectLanguage` usando `highlight.js`.
- [ ] Desenvolver o componente `CodeEditor` base com CodeMirror 6.
- [ ] Configurar a exibição de números de linhas no CodeMirror.
- [ ] Implementar hook de persistência no `localStorage`.
- [ ] Criar extensão/decorator para CodeMirror que utiliza `shiki` para o highlighting (ou usar `@shikijs/codemirror`).
- [ ] Integrar o `LanguageSelector` com o estado do editor.
- [ ] Implementar lógica de `onPaste`:
    - [ ] Disparar `detectLanguage`.
    - [ ] Disparar formatação automática.
- [ ] Garantir que os tokens de cores do Shiki respeitem as variáveis de cores do Tailwind 4 em `globals.css`.
- [ ] Adicionar suporte a atalhos de teclado (ex: `Cmd + S` para salvar, `Cmd + Shift + F` para formatar).
