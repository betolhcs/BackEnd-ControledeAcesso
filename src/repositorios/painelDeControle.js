const bancoDeDados = require('../bancoDeDados/index')

painelDeControleRepositorio = {
	
	buscarTodos: async function () {
		const resultado = await bancoDeDados.query(`SELECT * FROM "painel_de_controle" ORDER BY "data" DESC,"hora" DESC;`)
		const dataFormatada = await bancoDeDados.query(`SELECT "hora", TO_CHAR("data", 'dd/mm/yyyy') 
            FROM "painel_de_controle" ORDER BY "data" DESC,"hora" DESC;`)
		resultado.rows.forEach( function(elemento, indice) {
			elemento.data = dataFormatada.rows[indice].to_char
		});
		return resultado.rows
	},
	gerarRelatorio: async function(){
        const tabela = await this.buscarTodos()
        const entradaMaisRecente = tabela[0]
        const entradaMaisAntiga = tabela[tabela.length-1]
        ejs.renderFile("../relatorios/templateControle.ejs", {tabela:tabela},async (erro,html) => {
            if (erro){
                console.log(erro)
            }
            else {
                const browser = await puppeteer.launch({executablePath:'/usr/bin/chromium-browser'})
                const page = await browser.newPage()
                await page.setContent(html)
                const pdf = await page.pdf({path:`../relatorios/Controle/PainelDeControleDe${entradaMaisAntiga.data}Ate${entradaMaisRecente.data}.pdf`})
                await browser.close();
            }
        })
        await bancoDeDados.query(`DELETE FROM "painel_de_controle"`)
    },
    listarRelatorios: async function(){
        const arquivos = await glob.sync("*.pdf", {cwd:"../relatorios/Controle"})
        const relatorios = await arquivos.map((arquivo)=>{
            return {arquivo:arquivo, link:`../../cda-interno-backend/src/relatorios/Controle/${arquivo}`}
        })
        return relatorios
    }
}

module.exports = painelDeControleRepositorio