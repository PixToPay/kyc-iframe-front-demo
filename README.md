# PixtoPay KYC Iframe Demo

Demonstração interativa e visual do fluxo de verificação KYC via iframe, incluindo animações, status visual, timeline dinâmica, validação CPF, mock de API e identidade PixtoPay.

## Tecnologias

- **React 18** com TypeScript
- **Vite** como bundler
- **Tailwind CSS v4** para estilização
- **Framer Motion** para animações
- **TanStack React Query** para gerenciamento de estado
- **TanStack React Router** para roteamento
- **Axios** para requisições HTTP

## Estrutura do Projeto

```
src/
├── app/                    # Configuração da aplicação
├── components/             # Componentes React
│   ├── Header.tsx         # Cabeçalho com navegação
│   ├── Hero.tsx           # Seção principal
│   ├── HowItWorks.tsx     # Seção explicativa
│   ├── DemoSection.tsx    # Demonstração interativa
│   ├── Footer.tsx         # Rodapé
│   ├── ScrollToTop.tsx    # Botão flutuante
│   └── CpfForm.tsx        # Formulário de CPF
├── hooks/                 # Hooks customizados
│   ├── useScrollSection.ts # Detecção de seção
│   ├── usePostMessage.ts   # Eventos postMessage
│   └── useKycSession.ts    # Sessão KYC
├── lib/                   # Utilitários e configurações
│   ├── api.ts             # Configuração Axios
│   ├── kyc.ts             # URLs KYC
│   └── validators.ts      # Validações
├── routes/                # Páginas
├── styles/                # Estilos globais
└── theme/                 # Variáveis CSS
```

## Funcionalidades

### Navegação Inteligente

- Header com glassmorphism adaptativo
- Scroll suave entre seções
- Detecção automática de seção ativa
- Logos responsivos para fundo claro/escuro

### Demonstração Interativa

- Formulário de CPF com validação
- Geração de GUID para sessão
- Iframe com moldura realista
- Console de eventos postMessage em tempo real

### Design System

- Cores da marca PixtoPay
- Animações suaves com Framer Motion
- Layout responsivo mobile-first
- Tipografia Inter

## Configuração

### Variáveis de Ambiente

Crie os arquivos `.env.development` e `.env.production`:

```env
VITE_API_URL=https://api.dev.pixtopay.com
VITE_PUBLIC_KEY=pk_dev_xxxxxxxxx
VITE_KYC_FRONT_ORIGIN=https://kyc.dev.pixtopay.com
VITE_KYC_FRONT_ENTRY=/
VITE_ALLOWED_POSTMESSAGE_ORIGINS=https://kyc.dev.pixtopay.com
```

### Instalação

```bash
# Instalar dependências
yarn install

# Executar em desenvolvimento
yarn dev

# Build para produção
yarn build

# Preview do build
yarn preview
```

## Uso

### Integração via API

```typescript
const response = await fetch("https://api.dev.pixtopay.com/customer/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_PUBLIC_KEY"
  },
  body: JSON.stringify({
    cpf: "00000000272",
    integration_id: "GUID",
    webhook_url: "https://webhook.site/...", // opcional
    transaction_id: "GUID" // opcional
  }),
});
const { onboarding_id } = await response.json();
```

### Integração via Iframe

```jsx
<iframe
  src="https://kyc.pixtopay.com/?guid=123"
  onMessage={(event) => {
    if (event.data.type === "stepUpdate") {
      console.log("Etapa:", event.data.step);
    }
  }}
/>
```

### Dashboard

Acesse o dashboard em: https://backoffice.pixtopay.com.br/plataforma/

## Desenvolvimento

### Estrutura de Componentes

- **Header**: Navegação com glassmorphism adaptativo
- **Hero**: Seção principal com gradiente e mock mobile
- **HowItWorks**: Explicação dos métodos de integração
- **DemoSection**: Formulário + iframe + console
- **Footer**: Links essenciais e informações

### Hooks Customizados

- **useScrollSection**: Detecta seção ativa para header adaptativo
- **usePostMessage**: Escuta eventos do iframe
- **useKycSession**: Gerencia sessões KYC

### Estilização

- **Tailwind CSS v4** com `@theme` syntax
- **Variáveis CSS** para cores da marca
- **Responsive design** mobile-first
- **Animações** com Framer Motion

## Licença

© 2024 PixtoPay. Todos os direitos reservados.
