import { useCallback, useEffect, useState, useMemo } from "react";
import Tarefa from "./Tarefa";
import { useInput } from "../hooks/useInput";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";


const API_URL = "https://crudcrud.com/api/7e61ae2e41f049fdbd784a40f72b5ac0/tarefas";

function ListaTarefas() {
 
  const [tarefas, setTarefas] = useState([]);
  const tarefa = useInput();
  const { usuario } = useContext(UserContext);

  
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todas'); 

  
  useEffect(() => {
    fetch(API_URL)
      .then(resposta => resposta.json())
      .then(dados => setTarefas(dados))
      .catch(error => console.error("Erro ao buscar tarefas:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tarefa.valor === "") return;

    const nova = { usuario: usuario.nome, texto: tarefa.valor };
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nova)
    })
      .then(resposta => resposta.json())
      .then(tarefacriada => {
        setTarefas([...tarefas, tarefacriada]); 
        tarefa.limpar(); 
      })
      .catch(error => console.error("Erro ao adicionar tarefa:", error));
  }

 
  const handleExcluir = useCallback((id) => { 
    if (window.confirm("Deseja realmente excluir esta tarefa?")) { 
      fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      })
        .then(resposta => {
          if (resposta.ok) {
            setTarefas(prevTarefas => prevTarefas.filter(tarefa => tarefa._id !== id));
          } else {
            console.error("Erro ao excluir tarefa:", resposta.status);
          }
        })
        .catch(error => console.error("Erro ao excluir tarefa:", error));
    }
  }, []); 

  
  
  const handleAlternarConcluida = useCallback((idDaTarefa) => {
    setTarefas(prevTarepas => {
      const tarefasAtualizadas = prevTarepas.map(tarefa =>
        tarefa._id === idDaTarefa ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      );
      const tarefaParaAtualizar = tarefasAtualizadas.find(t => t._id === idDaTarefa);
      if (tarefaParaAtualizar) {
        const { _id, ...dadosParaAPI } = tarefaParaAtualizar; 
        fetch(`${API_URL}/${_id}`, {
          method: "PUT",  
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(dadosParaAPI)
        })
          .then(resposta => {
            if (!resposta.ok) {
              console.error("Erro ao atualizar status na API:", resposta.statusText);
              
            }
          })
          .catch(error => console.error("Erro ao atualizar status:", error));
      }
      return tarefasAtualizadas;
    });
  }, []);

  const tarefasFiltradas = useMemo(() => {
    return tarefas.filter(tarefa => {
      const correspondeTexto = tarefa.texto.toLowerCase().includes(filtroTexto.toLowerCase());
      const correspondeStatus = filtroStatus === 'todas' ||
        (filtroStatus === 'concluidas' && tarefa.concluida) ||
        (filtroStatus === 'pendentes' && !tarefa.concluida);
      return correspondeTexto && correspondeStatus;
    });
  }, [tarefas, filtroTexto, filtroStatus]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nova tarefa"
          value={tarefa.valor}
          onChange={tarefa.onChange}
        />
        <button type="submit">{usuario.nome} Adicionar</button>

      </form>
      <ul>
        {tarefas
          .filter(tarefa => tarefa.usuario === usuario.nome)
          .map(tarefa => <Tarefa key={tarefa._id}
            id={tarefa._id}
            texto={tarefa.texto} excluir={handleExcluir} aoAlternarConcluida={() => handleAlternarConcluida(tarefa._id)} />)}
      </ul>
      <div>
        <input type="text" placeholder="Filtrar por texto" value={filtroTexto} onChange={e => setFiltroTexto(e.target.value)} />
        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="concluidas">Concluídas</option>
          <option value="pendentes">Pendentes</option>
        </select>
      </div>

      <ul>
        {tarefasFiltradas
          .filter(tarefa => tarefa.usuario === usuario.nome)
          .map(tarefa => <Tarefa key={tarefa._id}
            id={tarefa._id}
            texto={tarefa.texto} excluir={handleExcluir} aoAlternarConcluida={() => handleAlternarConcluida(tarefa._id)} />)}
      </ul>

    </>
  )
}
export default ListaTarefas;
