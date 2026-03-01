import { useState, useEffect, memo} from "react";
import './Tarefa.css';

function Tarefa({ id, texto, excluir, aoAlternarConcluida }) {

    const [concluida, setConcluida] = useState(false);
    console.log('Componente Tarefa executado', texto);

    useEffect(() => { console.log('Componente Tarefa montado', texto) }, [])
    const alternarConcluida = () => {
        setConcluida(!concluida)
        aoAlternarConcluida(id); 
    }

   
    const handleExcluir = () => {
            if (excluir) {
                excluir(id);
            }
       
    }

    return (<li><input className="input" type="checkbox" onChange={alternarConcluida} /> <span className={concluida ? 'concluida' : ''}>{texto}</span> <button className="btn-remover" onClick={handleExcluir}>X</button></li>)
}
export default memo(Tarefa);