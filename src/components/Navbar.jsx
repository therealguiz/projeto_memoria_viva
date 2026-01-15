import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ aoClicarAdicionar }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const usuarioLogado = JSON.parse(localStorage.getItem('@usuario_logado'));
    
    const fazerLogout = () => {
        localStorage.removeItem('@usuario_logado');
        navigate('/');
    };

    return (
        <nav className="navegador">
            <div className="navegador-conteudo">
                <Link to={usuarioLogado ? "/memorias" : "/"}>
                    <h1 className="logo">Memória Viva</h1>
                </Link>

                <div className="links-nav">
                    <Link to="/" className={location.pathname === "/" ? "ativo" : ""}>Sobre</Link>
                    <Link to="/pessoas" className={location.pathname === "/pessoas" ? "ativo" : ""}>Pessoas</Link>
                    <Link to="/timeline" className={location.pathname === "/timeline" ? "ativo" : ""}>Linha do Tempo</Link>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    {usuarioLogado ? (
                        <>
                            <div style={{ textAlign: 'right', lineHeight: '1.2' }}>
                                <span style={{ fontSize: '11px', color: '#888', display: 'block', textTransform: 'uppercase' }}>Membro</span>
                                <span style={{ fontWeight: '600', color: 'var(--cor-primaria)', fontSize: '14px' }}>
                                    {usuarioLogado.mostrarApelido ? usuarioLogado.apelido : usuarioLogado.nome}
                                </span>
                            </div>

                            {location.pathname !== "/" && (
                                <button className="botao-primario" onClick={aoClicarAdicionar}>
                                    + Adicionar Memória
                                </button>
                            )}

                            <button 
                                onClick={fazerLogout}
                                style={{ background: 'none', border: 'none', color: '#a00', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        location.pathname !== "/" && (
                            <Link to="/" className="botao-primario">Entrar</Link>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;