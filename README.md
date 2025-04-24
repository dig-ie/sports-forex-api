**API de Esportes e Forex** – Uma API que fornece resultados esportivos, odds com formato amigável e conversão de moedas para apostas internacionais.  
**Sports-Forex API** – An API that provides sports results, odds, and currency conversion for international betting.

---

## 📋 Table of Contents
1. [Descrição / Description](#descrição--description)
2. [Endpoints Principais / Main Endpoints](#endpoints-principais--main-endpoints)
3. [Como Começar / Getting Started](#como-comecar--getting-started)
4. [Variáveis de Ambiente / Environment Variables](#variáveis-de-ambiente--environment-variables)
5. [Documentação Swagger / Swagger Docs](#documentação-swagger--swagger-docs)
6. [Rotina de Desenvolvimento e Deploy / Dev & Deploy Routine](#rotina-de-desenvolvimento-e-deploy--dev--deploy-routine)
7. [Commit Semântico / Semantic Commits](#commit-semântico--semantic-commits)
8. [Disclaimer e Créditos / Disclaimer & Credits](#disclaimer-e-créditos--disclaimer--credits)
9. [Licença / License](#licença--license)

---

## 📖 Descrição / Description
- **PT-BR:** API que agrega dados de esportes (resultados e odds) e informações financeiras (conversão de câmbio) de fontes públicas, apresentando-os de forma amigável para desenvolvedores.
- **EN:** API that aggregates sports data (results and odds) and financial data (currency conversion) from public sources, presenting it in a developer-friendly format.

---

## 🚀 Endpoints Principais / Main Endpoints

### Esportes / Sports
| Endpoint                              | Método | Descrição                                      |
|---------------------------------------|--------|------------------------------------------------|
| `/sports/soccer/leagues`              | GET    | Lista de ligas (por nome ou ID)                |
| `/sports/soccer/results`              | GET    | Resultados de jogos (liga, temporada, data)    |
| `/sports/soccer/odds`                 | GET    | Odds pré-jogo (liga, temporada, data)          |
| `/sports/soccer/odds/live`            | GET    | Odds ao vivo (jogos em andamento)              |

### Finanças / Finance
| Endpoint                                     | Método | Descrição                                                |
|----------------------------------------------|--------|----------------------------------------------------------|
| `/finance/currency?pair=USD-BRL`             | GET    | Cotações de câmbio para par de moedas (ex: USD-BRL)      |
| `/finance/convert?from=BRL&to=EUR&amount=100`| GET    | Converte valor entre moedas (ex: 100 BRL → EUR)          |

---

## ⚙️ Como Começar / Getting Started

1. **Clone o repositório / Clone the repo**
   ```sh
   git clone https://github.com/dig-ie/sports-forex-api.git
   cd sports-forex-api
   ```
2. **Instale as dependências / Install dependencies**
   ```sh
   npm install
   ```
3. **Configure as variáveis de ambiente / Set environment variables**  
   Veja [Variáveis de Ambiente](#variáveis-de-ambiente--environment-variables).
4. **Inicie em modo desenvolvimento / Run in development mode**
   ```sh
   npm run dev
   ```
5. **Acesse localmente / Access locally**  
   Abra no navegador ou use `curl`:
   ```
   http://localhost:5000
   ```

---

## 🛠️ Variáveis de Ambiente / Environment Variables

Crie um arquivo `.env` na raiz com:

```env
PORT=5000
API_FOOTBALL_URL=https://v3.football.api-sports.io
API_FOOTBALL_KEY=YOUR_API_FOOTBALL_KEY
ODDS_API_URL=https://api.the-odds-api.com/v4
ODDS_API_KEY=YOUR_ODDS_API_KEY
EXCHANGE_API_URL=https://economia.awesomeapi.com.br/json
```

---

## 📚 Documentação Swagger / Swagger Docs

Acesse a documentação interativa em:
```
http://localhost:5000/api-docs
```

---

## 🔧 Rotina de Desenvolvimento e Deploy / Dev & Deploy Routine

### Desenvolvimento Local / Local Development
```sh
npm run dev
npm run lint       # Verifica código com ESLint
```
- `console.log` é permitido no dev.

### Preparação para Deploy / Pre-Deploy
```sh
npm run predeploy  # Roda ESLint em modo produção (bloqueia console.log)
npm run build      # (Opcional) Build de produção
git push origin main
```
- `console.log` será bloqueado em produção.

---

## 📦 Commit Semântico / Semantic Commits

| Tipo       | Uso (PT-BR)                          | Usage (EN)                           |
|------------|--------------------------------------|--------------------------------------|
| `feat`     | Nova funcionalidade                  | New feature                          |
| `fix`      | Correção de bug                      | Bug fix                              |
| `refactor` | Refatoração (sem mudar comportamento)| Code refactoring                     |
| `style`    | Ajustes visuais/formatação           | Visual/style changes                 |
| `docs`     | Documentação                         | Documentation                        |
| `test`     | Testes                               | Tests                                |
| `chore`    | Tarefas auxiliares                   | Chores (configs, deps, etc.)         |

Exemplo:
```sh
git commit -m "feat(soccer): add odds endpoint with pre-game support"
```

---

## ⚠️ Disclaimer e Créditos / Disclaimer & Credits

> Esta API agrega dados de:
> - **API‑Football** (https://www.api‑football.com)  
> - **The Odds API** (https://the-odds-api.com)   

Dados fornecidos “as is”, sujeitos aos termos das fontes.  
Plano free: limites de requisições (ex: 500/mês em The Odds API).
Não redistribua os dados crus como produto.

---

## 📄 Licença / License

Este projeto está licenciado sob a **MIT License**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

# 🚧 Em desenvolvimento! Atualizações frequentes. 🚀
