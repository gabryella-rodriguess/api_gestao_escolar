import express from "express";
import { ObjectId } from "mongodb";
import { obterBanco } from "../db.js";

const router = express.Router();

function colecaoAlunos(){
    return obterBanco().collection("alunos");
}

function idValido(id){
    return ObjectId.isValid(id);
}

router.post("/", async(req, res) => {
    try{
        const {nome, idade, email, curso, turma} = req.body;

        if (!nome || idade == undefined || !email || !curso) {
            return res.status(400).json({
                mensagem: "Nome, idade, email e curso são obrigatórios"
            });
        }

       const novoAluno = {
        nome,
        idade: Number(idade),
        email,
        curso,
        turma: turma || null,
        ativo: true,
        dataMatricula: new Date()
};


        const resultado =
        await colecaoAlunos().insertOne(novoAluno);

        res.status(201).json({
            mensagem: "Aluno cadastrado com sucesso",
            aluno: {
                _id: resultado.insertedId,
                ...novoAluno
            }
        });
    } catch(erro){
        res.status(500).json({
            mensagem: "Erro ao cadastrar aluno",
            erro: erro.message
        });
    }
});

router.get("/", async (req, res) => {
    try {

        const {
            nome,
            curso,
            turma,
            idadeMin,
            idadeMax,
            ativo,
            campos,
            ordenarPor,
            direcao,
            limite
        } = req.query;

        // Filtro
        const filtro = {};

        // Filtro por nome
        if (nome) {
            filtro.nome = {
                $regex: nome,
                $options: "i"
            };
        }

        // Filtro por curso
        if (curso) {
            filtro.curso = curso;
        }

        // Filtro por turma
        if (turma) {
            filtro.turma = turma;
        }

        // Filtro por idade
        if (idadeMin || idadeMax) {
            filtro.idade = {};

            if (idadeMin) {
                filtro.idade.$gte = Number(idadeMin);
            }

            if (idadeMax) {
                filtro.idade.$lte = Number(idadeMax);
            }
        }

        
        if (ativo === "true") {
            filtro.ativo = true;
        }

        if (ativo === "false") {
            filtro.ativo = false;
        }

        
        let consulta = colecaoAlunos().find(filtro);

        
        if (campos) {
            const projection = {};

            campos.split(",").forEach(campo => {
                projection[campo] = 1;
            });

            consulta = consulta.project(projection);
        }

        
        if (ordenarPor) {
            const ordem = direcao === "desc" ? -1 : 1;

            consulta = consulta.sort({
                [ordenarPor]: ordem
            });
        }

        
        if (limite) {
            const quantidade = Number(limite);

            if (Number.isInteger(quantidade) && quantidade > 0) {
                consulta = consulta.limit(quantidade);
            }
        }

        const alunos = await consulta.toArray();

        res.json(alunos);

    } catch (erro) {

        res.status(500).json({
            mensagem: "Erro ao listar alunos",
            erro: erro.message
        });

    }
});


// router.get("/", async(req, res) => {
//     try{
//         const alunos = await colecaoAlunos()
//         .find()
//         .toArray();
//         res.json(alunos);

//     }catch(erro){
//         res.status(500).json({
//             mensagem: "Erro ao listar alunos",
//             erro: erro.message
//         })

//     }
// });

router.get("/ordenados/idade", async (req, res) => {

    try {
        const ordem = req.query.ordem === "desc" ? -1 : 1;

        const alunos = await colecaoAlunos()
        .find()
        .sort({idade: ordem})
        .toArray();

        res.json(alunos);
    }catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao ordenar alunos",
            erro: erro.message
        });
    }
});




router.get("/limite/:quantidade", async (req, res) => {

  try {
    const quantidade = Number(req.params.quantidade);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        mensagem: "Informe uma quantidade inteira maior que zero"
      });
        }

      const alunos = await colecaoAlunos()
      .find()
      .limit(quantidade)
      .toArray();

      res.json(alunos);
      
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro ao limitar resultados",
      erro: erro.message
    });
    
  }
});


router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensagem: "ID inválido"
            });
        }

        const idObjeto = new ObjectId(id);

        const {nome, idade, email, curso, turma, telefone} = req.body;

        const resultado = await colecaoAlunos().updateOne(
            { _id: idObjeto },
            {
                $set: {
                    nome: nome,
                    idade: Number(idade),
                    email: email,
                    curso: curso,
                    turma: turma,
                    telefone: telefone
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json({
            mensagem: "Aluno atualizado com sucesso"
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao atualizar aluno",
            erro: erro.message
        });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                mensagem: "ID inválido"
            });
        }

        const idObjeto = new ObjectId(id);

        const resultado = await colecaoAlunos().deleteOne({ _id: idObjeto });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({
                mensagem: "Aluno não encontrado"
            });
        }

        res.json({
            mensagem: "Aluno excluído com sucesso"
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao excluir aluno",
            erro: erro.message
        });
    }
});


export default router;