import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Perfil = () => {
    const { email } = useParams();
    const [memoriasPessoa, setMemoriasPessoa] = useState([]);
    const [dadosDono, setDadosDono] = useState(null);
    const carrosselRef = useRef(null);

    useEffect(() => {
        const todas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
        const filtradas = todas.filter(m => m.autorEmail === email);
        setMemoriasPessoa(filtradas);

        const usuarios = JSON.parse(localStorage.getItem('@usuarios_viva')) || [];
        const dono = usuarios.find(u => u.email === email);
        setDadosDono(dono);
    }, [email]);

    const moverCarrossel = (direcao) => {
        if (carrosselRef.current) {
            const scrollAmount = 400;
            carrosselRef.current.scrollBy({
                left: direcao === 'esquerda' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <Navbar />
            <main className="pagina-padrao">
                <section className="trilho-memorias">
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '30px',
                        paddingRight: '5%'
                    }}>
                        <div>
                            <h2 className="titulo-trilho" style={{ margin: 0 }}>
                                Memórias de {dadosDono ? (dadosDono.mostrarApelido ? dadosDono.apelido : dadosDono.nome) : 'Membro'}
                            </h2>
                            <p style={{ color: '#888', margin: '5px 0 0 0' }}>
                                {memoriasPessoa.length} {memoriasPessoa.length === 1 ? 'história compartilhada' : 'histórias compartilhadas'}
                            </p>
                        </div>

                        {memoriasPessoa.length > 0 && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => moverCarrossel('esquerda')} className="btn-scroll">❮</button>
                                <button onClick={() => moverCarrossel('direita')} className="btn-scroll">❯</button>
                            </div>
                        )}
                    </div>

                    <div className="carrossel esconder-scroll" ref={carrosselRef}>
                        {memoriasPessoa.length === 0 ? (
                            <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '12px', width: '100%', textAlign: 'center', border: '1px dashed #ccc' }}>
                                <p style={{ color: '#888' }}>Esse membro ainda não compartilhou nenhuma memória.</p>
                                <Link to="/memorias" style={{ color: 'var(--cor-primaria)', fontWeight: 'bold' }}>Voltar para o feed</Link>
                            </div>
                        ) : (
                            memoriasPessoa.map((memoria) => (
                                <Link key={memoria.id} to={`/memoria/${memoria.id}`} className="card-memoria">
                                    <div className="card-imagem" style={{ backgroundImage: `url(${memoria.imagem})` }}></div>
                                    <h3 className="card-titulo">{memoria.titulo}</h3>
                                    <p className="card-descricao">{memoria.descricao.substring(0, 60)}...</p>
                                    <div className="card-footer-stats">
                                        <span>❤️ {memoria.curtidas || 0}</span>
                                        <span>💬 {(JSON.parse(localStorage.getItem('@comentarios_memorias'))?.[memoria.id]?.length) || 0}</span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Perfil;