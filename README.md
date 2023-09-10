# Thata System

## Sobre

O Thata System é um projeto de front-end desenvolvido como um MVP para a pós-graduação na PUC-Rio. Este repositório contém todos os arquivos e recursos necessários para executar o projeto. O front-end foi desenvolvido utilizando Next.js e utiliza as bibliotecas MUI (anteriormente Material-UI) para a interface do usuário e Alert Swal para notificações.

## Pré-requisitos

- Docker
- Docker Compose (opcional)

## Como começar

### Nota: Antes de tudo, certifique-se de ter o projeto tata-system-api em execução em localhost:5000

Para clonar o projeto citado acesse:
<https://github.com/lfelipeapo/tata-system-api>

### Usando Docker Compose

1. Clone o repositório para o seu ambiente local usando `git clone https://github.com/lfelipeapo/tata-system.git`.

2. Navegue até o diretório do projeto usando `cd tata-system`.

3. Execute o projeto usando `docker-compose up`.

4. Abra o navegador e visite `http://localhost:3000` para ver o projeto em execução.

### Usando Docker (sem Docker Compose)

1. Clone o repositório para o seu ambiente local usando `git clone https://github.com/lfelipeapo/tata-system.git`.

2. Navegue até o diretório do projeto usando `cd tata-system`.

3. Construa a imagem Docker usando `docker build -t tata-system .`.

4. Execute o contêiner usando `docker run -p 3000:3000 tata-system`.

5. Abra o navegador e visite `http://localhost:3000` para ver o projeto em execução.

## Estrutura do Projeto

O projeto está estruturado da seguinte forma:

- `public/`: Este diretório contém todos os arquivos estáticos usados no projeto.
- `src/`: Este diretório contém todos os arquivos de código-fonte do projeto.
- `package.json`: Este arquivo contém todas as dependências do projeto.

## Componente Tipo B (API Externa) - LegislacaoService
O projeto thattasystem integra-se com a API externa LegislacaoService fornecida pelo Senado Federal. Esta API fornece serviços para recuperação de Normas Jurídicas Federais.

### Base URL da API: <https://legis.senado.leg.br/dadosabertos>

### Endpoints Consumidos:

- Lista de normas da base do Senado Federal: /legislacao/lista.json
- Lista de termos do catálogo: /legislacao/termos.json
- Lista de Tipos de Norma: /legislacao/tiposNorma.json
- Lista de Tipos de Publicação: /legislacao/tiposPublicacao.json
- Lista de tipos de declaração: /legislacao/tiposVide.json
- Detalhes de uma norma através do código: /legislacao/{codigo}.json
- Lista de detalhes de declaração: /legislacao/tiposdeclaracao/detalhe.json
- Detalhes do documento através do tipo/número/ano ou através da data de assinatura/sequencial: /legislacao/{tipo}/{numdata}/{anoseq}.json
- Configuração da Integração:
O projeto utiliza a biblioteca axios para realizar as chamadas à API. A configuração padrão para todas as chamadas inclui o cabeçalho Accept: application/json, garantindo que a resposta seja sempre em formato JSON.

### Métodos Disponíveis no Serviço:

- getNormas(params)
- getTermos(params)
- getTiposNorma()
- getTiposPublicacao()
- getTiposVide()
- getNormaByCodigo(codigo, params)
- getTiposDeclaracaoDetalhe()
- getNormaDetails(tipo, numdata, anoseq, params)

Esta descrição fornece uma visão geral da integração do projeto thattasystem com a API LegislacaoService. Para mais detalhes sobre como usar cada método ou sobre os parâmetros específicos que cada endpoint aceita, consulte a documentação oficial da API ou o código-fonte do serviço no projeto.

## Thata System API - Descrição

A API Thata System foi desenvolvida utilizando OpenFlask, Swagger e Flask e está disponível localmente na rota `http://localhost:5000/`. Abaixo, segue uma descrição detalhada dos endpoints disponíveis:

### **Documentação**

Ao acessar a rota base `/`, o usuário é redirecionado para `/openapi`, onde pode escolher o estilo de documentação desejado: Swagger, Redoc ou RapiDoc.

### **Consulta Jurídica**

- **GET `/consulta`**: Obtém uma consulta jurídica pelo ID.
- **POST `/consulta`**: Cria uma nova consulta jurídica.
- **PUT `/consulta`**: Atualiza uma consulta jurídica existente.
- **DELETE `/consulta`**: Exclui uma consulta jurídica.
- **GET `/consultas`**: Obtém todas as consultas jurídicas ou filtradas por data, nome do cliente ou CPF do cliente.
- **GET `/consultas/hoje`**: Obtém as consultas jurídicas de hoje.
- **GET `/consultas/horario`**: Obtém as consultas jurídicas em um horário específico para determinada data.

### **Cliente**

- **GET `/cliente`**: Obtém um cliente pelo ID.
- **POST `/cliente`**: Cria um novo cliente.
- **PUT `/cliente`**: Atualiza um cliente existente.
- **DELETE `/cliente`**: Exclui um cliente.
- **GET `/clientes`**: Obtém todos os clientes ou filtrados por nome, CPF, data de cadastro ou data de atualização.

### **Documento**

- **GET `/documento`**: Obtém um documento pelo ID.
- **POST `/documento`**: Cria um novo documento.
- **PUT `/documento`**: Atualiza um documento existente.
- **DELETE `/documento`**: Exclui um documento.
- **POST `/documento/upload`**: Faz o upload de um documento PDF.
- **GET `/documentos`**: Obtém todos os documentos.

### **Usuário**

- **GET `/user`**: Obtém um usuário pelo ID.
- **POST `/user/authenticate`**: Realiza a autenticação de usuário.
- **POST `/user/create`**: Cria um usuário.
- **PUT `/user`**: Atualiza um usuário existente.
- **DELETE `/user`**: Exclui um usuário.
- **GET `/users`**: Obtém todos os usuários do banco de dados.

A API foi projetada para atender às necessidades de gerenciamento de consultas jurídicas, clientes, documentos e usuários. Cada endpoint possui parâmetros específicos e respostas detalhadas, incluindo códigos de status e mensagens de erro ou sucesso, conforme necessário.

**Descrição do Componente C Extra:**

---

**Nome:** Thatta Law API

**Versão:** 1.0.0

**Base URL:** [http://localhost:5001](http://localhost:5001)

**Tecnologia:** O serviço é construído usando JavaScript com a biblioteca Axios para fazer chamadas HTTP. Ele é hospedado e disponibilizado via Docker na rota especificada.

**Documentação:** A API oferece uma seleção de estilos de documentação, incluindo Swagger, Redoc e RapiDoc. Ao acessar a rota base ("/"), os usuários são redirecionados para "/openapi", onde podem escolher o estilo de documentação desejado.

**Rotas e Funcionalidades:**

1. **GET /**
   - **Descrição:** Redireciona para /openapi, tela que permite a escolha do estilo de documentação.

2. **GET /scrape**
   - **Descrição:** Esta rota é responsável por obter uma listagem do códice brasileiro, que é o conjunto legal brasileiro.
   - **Retorno:** Retorna uma lista de documentos ou leis brasileiros.
   - **Parâmetros:** Não requer parâmetros.
   - **Respostas:**
     - **200 OK:** Sucesso na obtenção da lista. Retorna um JSON contendo uma lista de documentos com detalhes como Autoridade, Data, Ementa, Link, Localidade, MaisDetalhes, Título e URN.
     - **400 Bad Request:** Erro na requisição. Retorna uma mensagem indicando o erro.
     - **422 Unprocessable Entity:** Erro de validação ou processamento da requisição. Retorna detalhes do erro.
     - **500 Internal Server Error:** Erro interno do servidor. Retorna uma mensagem indicando o erro.

**Código de Serviço:** O serviço utiliza a biblioteca Axios para criar uma instância de API com a URL base definida. A função `getLeis` é exportada e faz uma chamada GET para a rota "/scrape", passando quaisquer parâmetros fornecidos.

## Licença

Este projeto está licenciado sob a Licença GPL-3.0.
## Tecnologias Utilizadas no Projeto Thata System

O projeto Thata System foi desenvolvido utilizando uma combinação de tecnologias modernas e populares no desenvolvimento web. Abaixo, segue uma descrição das principais tecnologias e bibliotecas utilizadas:

1. **Node.js (v16.19.0)**: É uma plataforma construída sobre o motor JavaScript do Chrome para facilmente construir aplicações de rede rápidas e escaláveis. No projeto, ele serve como a base para a execução do código JavaScript no lado do servidor.

2. **Next.js (v13.4.7)**: É um framework React que permite funcionalidades como renderização do lado do servidor e geração de sites estáticos para aplicações React. Ele é usado para construir e servir a aplicação.

3. **React (v18.2.0) e React DOM (v18.2.0)**: React é uma biblioteca JavaScript para construir interfaces de usuário. React DOM é a ligação do React com o DOM (Document Object Model) do navegador.

4. **@mui/material (v5.13.6) e @mui/icons-material (v5.11.16)**: Anteriormente conhecido como Material-UI, é um popular framework de design de componentes React que implementa os princípios do Material Design da Google. O projeto utiliza tanto os componentes principais quanto os ícones fornecidos pelo MUI.

5. **Axios (v1.4.0)**: É uma biblioteca JavaScript popular para fazer requisições HTTP. É utilizada no projeto para fazer chamadas à API.

6. **js-cookie (v3.0.5)**: Uma biblioteca simples e leve para lidar com cookies no navegador.

7. **sweetalert2 (v11.7.12)**: Uma biblioteca JavaScript para criar alertas modernos e personalizados.

8. **react-dropzone (v14.2.3)**: É uma biblioteca React que fornece uma área de soltar arquivos (dropzone) para o usuário carregar arquivos.

9. **react-router-dom (v6.14.1)**: É uma biblioteca de roteamento para React que permite a navegação entre diferentes componentes, alterando a URL do navegador.

10. **@emotion/react e @emotion/styled**: São bibliotecas que permitem escrever estilos CSS diretamente no JavaScript, facilitando a criação de componentes estilizados no React.

11. **@mui/lab, @mui/x-data-grid e outras bibliotecas MUI**: São extensões do MUI que fornecem componentes adicionais e funcionalidades, como grades de dados e componentes experimentais.
