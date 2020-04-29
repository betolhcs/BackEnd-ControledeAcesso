const usuarioRepositorio = require('../repositorios/usuario')

const usuarioControladora = {
	
	listarTodos: async function(requisicao, resposta) {
    	const usuarios = await usuarioRepositorio.buscarTodos()
    	if (!usuarios) {
       	return resposta.status(404).json({erro: 'Não Há Membros no Banco de Dados'})
    	} 
      	return resposta.status(200).json(usuarios)
  	},

	inserir: async function (requisicao, resposta) {
		const dados = requisicao.body
		const somenteDigitosPermissao = /^\d+$/.test(dados.permissao)
		
		if (!dados.usuario || !dados.senha || !dados.permissao) {
			return resposta.status(400).json({erro : 'Estão Faltando Campos'})
		}

		const usuarioJaExiste =  await usuarioRepositorio.buscar(dados.usuario)
		
		if (usuarioJaExiste) {
			return resposta.status(400).json({erro : 'Usuário Já Cadastrado'})
		}

		if (!somenteDigitosPermissao) {
			return resposta.status(400).json({erro : 'Permissão Inválida'})
		}

		if (dados.permissao < 1 || dados.permissao > 4 ) {
			return resposta.status(400).json({erro : 'Nível de Permissão Inválido'})
		}

		await usuarioRepositorio.inserir(dados)
		usuarioCriado = await usuarioRepositorio.buscar(dados.usuario)
		delete usuarioCriado.senha
		return resposta.status(201).json(usuarioCriado)
	},

	remover: async function (requisicao, resposta) {
		const nomeDeUsuario = requisicao.params.usuario
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)
 		
 		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}
		
		await usuarioRepositorio.remover(nomeDeUsuario)
		return resposta.status(200).json({resultado :'Membro Deletado com Sucesso'})
	},

	editar: async function (requisicao, resposta) {
		const nomeDeUsuario = requisicao.params.usuario
		const dados = requisicao.body
		const usuarioExiste = await usuarioRepositorio.buscar(nomeDeUsuario)
		const somenteDigitosPermissao = /^\d+$/.test(dados.permissao)
		
		if (!usuarioExiste) {
			return resposta.status(400).json({erro : 'Usuário Não Encontrado'})
		}

		if (Object.keys(dados).length === 0) {
			return resposta.status(400).json({erro: 'Requisição Vazia'})
		}
		
		if(dados.usuario){
			const usuarioJaExiste = await usuarioRepositorio.buscar(dados.usuario)
			
			if (usuarioJaExiste) {
				return resposta.status(400).json({erro: 'Nome de Usuário Já Cadastrado'})
			}
		}

		if (dados.permissao || dados.permissao === 0) {
			
			if (!somenteDigitosPermissao) {
				return resposta.status(400).json({erro : 'Permissão Inválida'})
			}

			if (dados.permissao  < 1 || dados.permissao > 4) {
			return resposta.status(400).json({erro : 'Nível de Permissão Inválido'})
			}
		}
		await usuarioRepositorio.editar(dados, nomeDeUsuario)
		
		if (dados.usuario) {
			resultado = await usuarioRepositorio.buscar(dados.usuario)
			return resposta.status(200).json(resultado)
		} 
		
		resultado = await usuarioRepositorio.buscar(nomeDeUsuario)
		return resposta.status(200).json(resultado)
	}
}

module.exports = usuarioControladora