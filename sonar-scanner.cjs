const scanner = require('sonarqube-scanner');

 

scanner(

  {

    // Conexão com o servidor SonarQube

    serverUrl: 'http://localhost:9000',

 

    // Token de autenticação gerado no SonarQube

    // É uma boa prática usar variáveis de ambiente para o token, ex: process.env.SONAR_TOKEN

    token: "sqp_02398bf7bdf6afe8c29f3b8451622347263be052",

 

    // Opções de análise

    options: {

      // Identificador único do seu projeto no SonarQube

      'sonar.projectKey': 'cowlabsfinal',

 

      // Nome do projeto que será exibido no SonarQube

      'sonar.projectName': 'cowlabsfinal',

 

      // Caminho para os arquivos fonte a serem analisados

      'sonar.sources': '.',

 

      // (Opcional, mas recomendado) Arquivos a serem excluídos da análise

      'sonar.exclusions': 'node_modules/**,coverage/**',

 

      // (Opcional) Integração com relatórios de cobertura de testes (ex: Jest)

      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info'

    }

  },

  () => process.exit()

);