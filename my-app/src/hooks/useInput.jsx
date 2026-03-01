import { use, useEffect, useState } from "react";


//O hook useInput é uma função personalizada que encapsula a lógica de gerenciamento de estado para um campo de entrada, fornecendo um valor, uma função onChange para atualizar o valor e uma função limpar para resetar o campo.
export function useInput(valorInicial="") {
  
    const [valor, setValor] = useState(valorInicial)

    const onChange =(e) => {
        setValor(e.target.value);
    }

    const limpar = () => setValor("");
    return {
        valor,
        onChange,
        limpar
    };
}   
