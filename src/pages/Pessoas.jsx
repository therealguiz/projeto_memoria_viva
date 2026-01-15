import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Pessoas = () => {
    const [usuarios, setUsuarios] = useState([]);
    const usuarioLogado = JSON.parse(localStorage.getItem('@usuario_logado'));

    useEffect(() => {
        if (usuarioLogado) {
            const cadastrados = JSON.parse(localStorage.getItem('@usuarios_viva')) || [];
            setUsuarios(cadastrados);
        }
    }, []);

    return (
        <>
            <Navbar />
            <main className="pagina-padrao">
                <section className="trilho-memorias" style={{ alignItems: 'center', paddingLeft: 0 }}>
                    <h1 className="titulo-trilho">Membros da Família</h1>
                    {usuarioLogado ? (
                        <p style={{ color: '#888' }}>Clique em um membro para ver suas histórias</p>
                    ) : (
                        <p style={{ color: '#B87A5E', fontWeight: 'bold' }}>
                            Acesse sua conta para conhecer os membros da família.
                        </p>
                    )}
                </section>

                <section className="container-pessoas">
                    {!usuarioLogado ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                            <p style={{ color: '#888', marginBottom: '20px' }}>
                                A visualização de membros é restrita a usuários cadastrados.
                            </p>
                            <Link to="/" className="botao-primario">
                                Ir para Login / Cadastro
                            </Link>
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
                            <p>Ainda não há outros membros cadastrados.</p>
                        </div>
                    ) : (
                        usuarios.map((user, index) => (
                            <Link 
                                key={index} 
                                to={`/perfil/${user.email}`} 
                                className="perfil-pessoa" 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="foto-perfil" style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: '40px',
                                    color: 'var(--cor-primaria)',
                                    backgroundColor: 'var(--cor-cinza)'
                                }}>
                                    {(user.mostrarApelido ? user.apelido : user.nome).charAt(0).toUpperCase()}
                                </div>
                                <span className="nome-pessoa">
                                    {user.mostrarApelido ? user.apelido : `${user.nome} ${user.sobrenome}`}
                                </span>
                            </Link>
                        ))
                    )}
                </section>
            </main>
        </>
    );
};

export default Pessoas;