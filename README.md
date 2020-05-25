### Este é uma aplicação de teste de frontend

## Estrutura do projeto

```
├── assets
│   ├── fonts
│   ├── images
│   ├── scripts
│   ├── scripts-source
│   ├── styles
│   ├── styles-source
│   │   └── sass
│   └── svg
├── index.html
├── gulpfile.js
├── .editorconfig
├──  package.json

```

## Como executar o Projeto

1. Primeiro certique-se que tenha instalado o NPM e GULP de forma Global
2. Baixe ou clone o projeto do Github
3. Na pasta raiz execute `npm install`
4. Este projeto utiliza `BrowserSync` então para rodar o projeto basta digitar `gulp serve`
5. Ele deve abrir seu navegador no seguinte endereço http://localhost:3000.
6. Caso não tenha aberto digite o endereço http://localhost:3000 na barra de endereço do navegador.
7. Caso tenha um servidor e não queira usar o `BrowserSync` apenas coloque os arquivos no servidor e execute o comando `gulp` e todos os arquivos estarão sendo assistido para que possa editar.

## Tecnologias

- Este projeto usa `sass`, `javascript` a biblioteca do `axios` para consumo das api's de forma mais dinâmica
- `Gulp` para automatizar as tarefas de compilação, minimificação, concatenação de arquivos, conversão de imagens para o formato .webP e geração de Fontface a partir de um .svg;
- `BrowserSync` para não havert necessidade de criar um servidor
-
