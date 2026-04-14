# Anafit & LipeFit — Guia de Configuração

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Vá em **SQL Editor** e rode o arquivo `supabase/schema.sql`
3. Vá em **Authentication > Users** e crie um usuário admin (email + senha)
4. Copie a **Project URL** e a **anon key** em: Settings > API

## 3. Criar o arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5...
```

## 4. Rodar localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

## 5. Deploy no Vercel

1. Faça push do projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o repositório
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`
4. Deploy automático!

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Homepage com carrossel |
| `/produtos` | Catálogo com filtros |
| `/produtos/[id]` | Detalhe do produto |
| `/sobre` | Sobre a marca |
| `/contato` | Formulário de contato |
| `/faq` | Perguntas frequentes |
| `/admin` | Painel administrativo |
| `/admin/login` | Login do admin |

## Painel Admin

- Acesse `/admin` — redireciona para `/admin/login`
- Use o email/senha criado no Supabase Auth
- Funcionalidades: listar, criar, editar e excluir produtos
