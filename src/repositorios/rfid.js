const bancoDeDados = require('../bancoDeDados/index')

/**
    * Repositório de funções do banco de dados do RFID
    * @namespace repositorioRfid
*/

const rfid = {
    /**
        * Busca a entrada mais recente no banco de dados
        * @memberof repositorioRfid
        * @method buscarUltima
        * @returns {Object} Uma linha da tabela com os dados da entrada mais recente
    */
    buscarUltima: async function() {
        const resultado = await bancoDeDados.query(`SELECT * FROM "rfidlog" ORDER BY "horario" DESC LIMIT 1;`)
        return (resultado.rows[0])
    },
    /**
        *Insere uma entrada no banco de dados
        * @memberof repositorioRfid
        * @method inserir
        * @param {Object} dados Um objeto que contém os dados necessários para criar a entrada no banco de dados
        * @param {String} dados.rfid Uma string contendo o valor o código do rfid formatado adequadamente
        * @param {Boolean} dados.valido Um booleano que indica se o cartão é valido ou não 
    */
    inserir: async function(dados){
        await bancoDeDados.query(`INSERT INTO "rfidlog" ("nome","rfid","valido","data","horario") 
            VALUES ('${dados.nome}', '${dados.rfid}', ${dados.valido}, CURRENT_DATE, LOCALTIME);`,
        function (erro,resposta) {
            if (erro) {
                console.log(erro)
            }
        })
    },
    /**
        * Busca todas as entradas do banco de dados em ordem da mais recente para menos recente
        * @memberof repositorioRfid
        * @method buscarTodos
        * @returns {Array} Um array de objetos contendo todas as linhas da tabela
    */
    buscarTodos: async function(){
        const historico = await bancoDeDados.query(`SELECT * FROM "rfidlog" ORDER BY "data" DESC,"horario" DESC;`)
        const datasFormatadas = await bancoDeDados.query(`SELECT "horario", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "rfidlog" ORDER BY "data" DESC,"horario" DESC;`)
        for (var i = 0; i < historico.rows.length; i++) {
            historico.rows[i].data = datasFormatadas.rows[i].to_char
        }
        return historico.rows
    },
    removerUltimoMes: 3 //Pra n ficar guardando dados desnecessários
}

module.exports = rfid
