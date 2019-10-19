const mysql = require('mysql');

let conexao = null;

module.exports = {
  conectar,
  inserirTweet,
  listaEventosPorEmpresa

}

function inserirTweet(empresa)
{
  return new Promise((resolve, reject) => {

  const sql = `INSERT INTO empresas set nome = ?`;

    conexao.query(sql, [empresa] , (erro, results, fields) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(results);
      }
    });

  });
}


function conectar(options) {
  if (conexao == null) {
    return new Promise((resolve, reject) => {

      console.log('Iniciando conexão em banco de dados');

      conexao = mysql.createConnection({
        host: options.host,
        port: options.porta,
        database: options.banco,
        user: options.usuario,
        password: options.senha
      });

      conexao.connect(erro => {
        if (erro) {
          console.error('Erro ao conectar no banco de dados', erro);
          reject(erro);
        } else {
          console.log('Conectado ao banco de dados');
          resolve();
        }
      });

    });
  } else {
    console.log('Aplicação ja esta conectada ao banco de dados');
    return Promise.resolve(conexao);
  }
}
function listaEventosPorEmpresa() {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM AGENDA_EVENTOS ORDER BY data_evento';

    conexao.query(sql, (erro, results, fields) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(
          results.map(registroEvento => {
            return {
              id: registroEvento.id,
              tipo_evento: registroEvento.tipo_evento,
              descricao: registroEvento.descricao,
              data_evento: registroEvento.data_evento,
              horario: registroEvento.horario
            }
          })
        );
      }
    });
  });
}

