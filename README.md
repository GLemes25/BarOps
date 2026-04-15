# 🍸 BarOps - Gerenciador de Orçamentos para Eventos

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-000000?style=for-the-badge)
![Neon DB](https://img.shields.io/badge/Neon_Serverless-00E599?style=for-the-badge)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-111827?style=for-the-badge)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

---

> Projeto desenvolvido com foco em demonstrar **engenharia de software full-stack moderna**, modelagem de dados e resolução de problemas reais de negócio no setor de eventos.

<!-- ---

## 🚀 Demo Online

[![Deploy Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://seu-link-deploy.vercel.app/)

👉 **Acesse a aplicação em produção:**
🔗 https://seu-link-deploy.vercel.app/ _(atualize após deploy)_

--- -->

<!-- ## 📸 Preview -->

<!-- Adicione aqui um GIF ou screenshot -->
<!-- Exemplo: ![Preview](./.github/preview.gif) -->

---

## 📋 Sobre o Projeto

O **BarOps** é uma aplicação web **Full-Stack** projetada como um **mini-ERP especializado em coquetelaria e eventos**.

Diferente de sistemas genéricos, ele resolve problemas reais do negócio:

- Cálculo preciso de insumos baseado em rendimento
- Planejamento operacional de eventos
- Projeção de custos e compras automatizadas

O sistema transforma dados operacionais em **decisões financeiras inteligentes**.

---

## ✨ Funcionalidades

- 📊 **Dashboard Analítico** com métricas de receita e consumo
- 🍋 **Gestão Inteligente de Ingredientes** com conversão entre unidades
- 🍹 **Engenharia de Drinks** (fichas técnicas dinâmicas)
- 👥 **Gestão de Equipe** com custo base + hora extra
- 🗓️ **Planejamento de Eventos** com rotas dinâmicas
- 🛒 **Lista de Compras Automatizada** baseada em consumo real
- 💰 **Cálculo de Custos em Tempo Real**

---

## 🛠️ Tecnologias Utilizadas

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### UI & UX

- shadcn/ui
- Lucide React
- next-themes (Dark Mode)

### Backend

- Next.js Server Actions

### Banco de Dados

- Neon DB (PostgreSQL Serverless)
- Drizzle ORM

### Validação & Utilitários

- React Hook Form + Zod
- Day.js

### Infra

- pnpm

---

## 🧩 Destaques Técnicos

- ⚙️ **Arquitetura de Colocation**  
  Componentes client e server organizados por contexto funcional

- ⚡ **Server Actions + Revalidação**  
  Mutations com `revalidatePath` e `router.refresh()` sem reload

- 🔒 **Transações SQL Seguras**  
  Uso de `db.transaction` garantindo integridade relacional

- 🧠 **Modelo de Rendimento Matemático**  
  Cálculo preciso de custo por unidade (ml/g) independente da compra

- 📦 **Separação de Unidade de Compra vs Receita**  
  Evita erro comum em sistemas de estoque

---

## 🏗️ Arquitetura

- App Router (Next.js)
- Server Components para data fetching
- Client Components para interatividade
- Persistência direta via Server Actions
- Banco relacional normalizado

---

## 📁 Estrutura do Projeto

```bash
src/
 ├── app/
 ├── components/
 ├── db/
 ├── lib/
 ├── hooks/
 ├── types/
 └── utils/
```

## 💾 Exemplos de Código

⚡ Server Action com Revalidação

```
export const deleteDrink = async (id: number) => {
  await db.delete(drinkIngredients).where(eq(drinkIngredients.drinkId, id));
  await db.delete(drinks).where(eq(drinks.id, id));

  revalidatePath("/drinks");
};
```

## 🧠 Modelagem com Drizzle ORM

```
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  recipeUnit: text("recipe_unit").notNull(),
  purchaseUnit: text("purchase_unit").notNull(),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }).notNull(),
  yieldQuantity: decimal("yield_quantity", { precision: 10, scale: 4 }).notNull(),
});
```

## 🚀 Como Executar o Projeto

```
# Clone o repositório
git clone https://github.com/GLemes25/seu-repositorio-barops.git

# Acesse a pasta
cd seu-repositorio-barops

# Instale as dependências
pnpm install

# Configure o ambiente (.env.local)
DATABASE_URL="postgresql://usuario:senha@neon..."

# Suba o schema
pnpm drizzle-kit push

# (Opcional) Seed
pnpm tsx db/seed.ts

# Rodar projeto
pnpm dev
```

### 🔮 Possíveis Evoluções

- Integração com IA (sugestão de drinks por tipo de evento)
- Geração de PDF (orçamento + compras)
- Autenticação com Auth.js / NextAuth
- Cálculo automático de margem de lucro
- Relatórios financeiros avançados

### 👤 Autor

## Gabriel Lemes de Oliveira

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/gabriel-lemes-G25)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:gabriellemes924@gmail.com)
[![Whatsapp](https://img.shields.io/badge/Whatsapp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/5567991179190)
