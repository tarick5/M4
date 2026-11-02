import { useEffect, useMemo, useState } from 'react';

const habitosIniciais = [
    { id: 1, nome: 'Beber água', categoria: 'Bem-estar', concluido: true },
    { id: 2, nome: 'Estudar React durante 30 minutos', categoria: 'Estudo', concluido: false },
    { id: 3, nome: 'Caminhar ao fim da tarde', categoria: 'Movimento', concluido: false }
];

const opcoesFiltro = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'pendentes', texto: 'Por concluir' },
    { valor: 'concluidos', texto: 'Concluídos' }
];

function FormularioHabito({ aoAdicionar }) {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('Bem-estar');
    const [erro, setErro] = useState('');

    function submeterFormulario(evento) {
        evento.preventDefault();
        const nomeLimpo = nome.trim();

        if (nomeLimpo.length < 3) {
            setErro('Escreve um hábito com pelo menos 3 caracteres.');
            return;
        }

        aoAdicionar(nomeLimpo, categoria);
        setNome('');
        setErro('');
    }

    return (
        <form className="formulario" onSubmit={submeterFormulario}>
            <div className="campo campo-principal">
                <label htmlFor="nome-habito">Novo hábito</label>
                <input
                    id="nome-habito"
                    value={nome}
                    onChange={(evento) => setNome(evento.target.value)}
                    placeholder="Ex.: Ler 10 páginas"
                    maxLength="80"
                />
            </div>

            <div className="campo">
                <label htmlFor="categoria">Categoria</label>
                <select id="categoria" value={categoria} onChange={(evento) => setCategoria(evento.target.value)}>
                    <option>Bem-estar</option>
                    <option>Estudo</option>
                    <option>Movimento</option>
                    <option>Pessoal</option>
                </select>
            </div>

            <button type="submit">Adicionar</button>
            <p className="erro" aria-live="polite">{erro}</p>
        </form>
    );
}

function Filtros({ filtroAtual, aoMudar }) {
    return (
        <div className="filtros" aria-label="Filtrar hábitos">
            {opcoesFiltro.map((opcao) => (
                <button
                    type="button"
                    key={opcao.valor}
                    className={filtroAtual === opcao.valor ? 'filtro ativo' : 'filtro'}
                    onClick={() => aoMudar(opcao.valor)}
                    aria-pressed={filtroAtual === opcao.valor}
                >
                    {opcao.texto}
                </button>
            ))}
        </div>
    );
}

function CartaoHabito({ habito, aoAlternar, aoRemover }) {
    return (
        <li className={habito.concluido ? 'habito concluido' : 'habito'}>
            <button
                type="button"
                className="estado"
                onClick={() => aoAlternar(habito.id)}
                aria-label={habito.concluido ? `Marcar ${habito.nome} como por concluir` : `Marcar ${habito.nome} como concluído`}
            >
                {habito.concluido ? '✓' : ''}
            </button>

            <div className="informacao-habito">
                <strong>{habito.nome}</strong>
                <span>{habito.categoria}</span>
            </div>

            <button type="button" className="remover" onClick={() => aoRemover(habito.id)}>
                Remover
            </button>
        </li>
    );
}

export default function App() {
    const [habitos, setHabitos] = useState(habitosIniciais);
    const [filtro, setFiltro] = useState('todos');
    const [pesquisa, setPesquisa] = useState('');

    const resumo = useMemo(() => {
        const concluidos = habitos.filter((habito) => habito.concluido).length;
        const percentagem = habitos.length === 0 ? 0 : Math.round((concluidos / habitos.length) * 100);

        return { concluidos, percentagem };
    }, [habitos]);

    const habitosVisiveis = useMemo(() => {
        const termo = pesquisa.trim().toLocaleLowerCase('pt-PT');

        return habitos.filter((habito) => {
            const correspondeAoFiltro = filtro === 'todos'
                || (filtro === 'concluidos' && habito.concluido)
                || (filtro === 'pendentes' && !habito.concluido);
            const correspondeAPesquisa = habito.nome.toLocaleLowerCase('pt-PT').includes(termo)
                || habito.categoria.toLocaleLowerCase('pt-PT').includes(termo);

            return correspondeAoFiltro && correspondeAPesquisa;
        });
    }, [habitos, filtro, pesquisa]);

    useEffect(() => {
        document.title = `${resumo.percentagem}% concluído | FocusFlow`;
    }, [resumo.percentagem]);

    function adicionarHabito(nome, categoria) {
        setHabitos((atual) => [
            ...atual,
            { id: Date.now(), nome, categoria, concluido: false }
        ]);
    }

    function alternarHabito(id) {
        setHabitos((atual) => atual.map((habito) => (
            habito.id === id ? { ...habito, concluido: !habito.concluido } : habito
        )));
    }

    function removerHabito(id) {
        setHabitos((atual) => atual.filter((habito) => habito.id !== id));
    }

    return (
        <main className="pagina">
            <header className="cabecalho">
                <div>
                    <p className="etiqueta">Módulo 4 · Exercício 01</p>
                    <h1>FocusFlow</h1>
                    <p className="subtitulo">Pequenos hábitos, progresso visível.</p>
                </div>
                <div className="resumo" aria-label="Resumo diário">
                    <strong>{resumo.percentagem}%</strong>
                    <span>{resumo.concluidos} de {habitos.length} concluídos</span>
                </div>
            </header>

            <section className="progresso" aria-label={`${resumo.percentagem}% dos hábitos concluídos`}>
                <div className="barra" aria-hidden="true">
                    <span style={{ width: `${resumo.percentagem}%` }} />
                </div>
                <p>O teu progresso de hoje está em {resumo.percentagem}%.</p>
            </section>

            <section className="painel" aria-labelledby="titulo-adicionar">
                <h2 id="titulo-adicionar">Adicionar hábito</h2>
                <FormularioHabito aoAdicionar={adicionarHabito} />
            </section>

            <section className="painel" aria-labelledby="titulo-lista">
                <div className="cabecalho-lista">
                    <div>
                        <h2 id="titulo-lista">Hábitos de hoje</h2>
                        <p>Seleciona o círculo para marcar um hábito como concluído.</p>
                    </div>
                    <label className="pesquisa" htmlFor="pesquisa">
                        <span>Pesquisar</span>
                        <input
                            id="pesquisa"
                            value={pesquisa}
                            onChange={(evento) => setPesquisa(evento.target.value)}
                            placeholder="Nome ou categoria"
                        />
                    </label>
                </div>

                <Filtros filtroAtual={filtro} aoMudar={setFiltro} />

                {habitosVisiveis.length > 0 ? (
                    <ul className="lista-habitos">
                        {habitosVisiveis.map((habito) => (
                            <CartaoHabito
                                key={habito.id}
                                habito={habito}
                                aoAlternar={alternarHabito}
                                aoRemover={removerHabito}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="vazio">Não foram encontrados hábitos com estes critérios.</p>
                )}
            </section>
        </main>
    );
}
