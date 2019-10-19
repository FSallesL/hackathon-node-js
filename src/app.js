const express = require('express');

const TwitterService = require('./twitter.service');
const DbService = require('./db.service');

const app = express();

app.use(express.json());

app.get('/listaEventosPorEmpresa', (request, response) => {
  /*
    entrada:
    {
      "empresa"   : "hitbra"
    }

    saída
    [
      {
        "data": "19/10/2019",
        "eventos": [
          {
            "horario": "12:00",
            "categoria": "reuniao"
            "descricao": "vamos pra sala de reuniao",
            "pessoas": [
              "giovane",
              "rubens"
            ]
          },
          {
            "horario": "21:00",
            "categoria": "churrasco"
            "descricao": "niver do Rubao",
            "pessoas": [
              "giovane",
              "rubens",
              "marcos"
            ]
          }
        ]
      }
    ]
  */

  response.send();
});

app.get('/listaEventosPorData', (request, response) => {
  /*
    entrada:
    {
      "empresa"   : "hitbra"
      "dataInicio"  : "19/10/2019",
      "dataFim"    : "20/10/2019"
    }	
    
    saída:
    [
      {
        "empresa": "hitbra",
        "data": "19/10/2019",
        "eventos": [
          {
            "horario": "12:00",
            "categoria": "reuniao"
            "descricao": "vamos pra sala de reuniao",
            "pessoas": [
              "giovane",
              "rubens"
            ]
          },
          {
            "horario": "21:00",
            "categoria": "churrasco"
            "descricao": "niver do Rubao",
            "pessoas": [
              "giovane",
              "rubens",
              "marcos"
            ]
          }
        ]
      }
    ]
  */
  response.send();
});

app.get('/listaEventosPorPessoa', (request, response) => {
  /*
    entrada:
    {
      "pessoa" : "giovane"
      "ordenacao" : "ASC"
    }	

    saída:
    [
      {
        "data": "19/10/2019",
        "eventos": [
          {
            "horario": "12:00",
            "descricao": "vamos pro almoço",
            "pessoas": [
              "giovane",
              "rubens",
              "marcos"
            ]
          },
          {
            "horario": "13:00",
            "descricao": "vamos reencontrar a turma",
            "pessoas": [
              "rubens"
            ]
          }
        ]
      }
    ]
  */
  response.send();
});

app.get('/listaEventosRepetitivos', (request, response) => {
  /*
    entrada:
    {
    }	

    saída:
    [
      {
        "pessoa": "giovane",
        "quantidade": 150
      },
      {
        "pessoa": "rubens",
        "quantidade": 100
      },
      {
        "pessoa": "marcos",
        "quantidade": 0
      }
    ]
  */
  response.send();
});

app.get('/listaHorarios', (request, response) => {
  /*
    entrada:
    {
      "mes" : "Outubro",
      "ano" : "2019"
    }	

    saída:
    [
      {
        "horario": "12:00",
        "quantidade": 10
      },
      {
        "horario": "18:00",
        "quantidade": 8
      },
      {
        "horario": "21:00",
        "quantidade": 5
      }
    ]
  */
  response.send();
});

const server = app.listen(3000, () => {
  console.log('Servidor iniciado');

  DbService.conectar({
    host: 'localhost', 
    porta: 3306, 
    banco: 'pet_shop', 
    usuario: 'root', 
    senha: '123456'
  })
    .then(() => {
      console.log('Conexão com banco de dados estabelecida');

      TwitterService.newClient({
        consumer_key: 'URKM9MWFpwZgKfbxwsGqNE0MT',
        consumer_secret: 'HXOZCQPhv2MhAaLSj07Ss2ODhQh64IObDYstYUwG8EyLzYQOFD',
        access_token_key: '187744844-EHU5axWK55BmRappDWkoVlI6eSpfZ3NV1W7z2kMJ',
        access_token_secret: 'DHx58GbWYrC87Fs026RitPaNYyojNJ8L8d47MvmRbj9uh'
      });
      console.log('Client do Twitter criado');

      TwitterService.listarTweetsHitBRA('@HitBra')
        .then(tweets => {
          console.log(`Recebido ${tweets.length} para processar`);
          
          /*
            *** Implemente aqui sua lógica para ler o tweets ***
            
            O parâmetro "tweets" é um array de objetos com a seguinte estrutura:
            {
              "texto": "string",
              "hashtags": [
                "string"
              ]
            }

            Exemplo: 
            {
              "texto": "#hackathonhitbra hitbra festa 10/11/2019 21:00 vamos comemorar o hackathon  *marcos *rubens *giovane",
              "hashtags": [
                "hackathonhitbra"
              ]
            }
          */
        })
        .catch(erro => {
          console.error('Erro ao listar Tweets da Hit-BRA:', erro);
          server.close();
        });
    })
    .catch(erro => {
      console.log('Devido erro ao conectar com o banco de dados a aplicação será encerrada');
      console.error(erro);
      server.close();
    });
});
