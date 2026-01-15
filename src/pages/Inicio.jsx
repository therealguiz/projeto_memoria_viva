import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Inicio = () => {
    const navigate = useNavigate();
    const [isCadastro, setIsCadastro] = useState(false);

    const handleAcao = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);

        const usuariosExistentes = JSON.parse(localStorage.getItem('@usuarios_viva')) || [];

        if (isCadastro) {
            dados.mostrarApelido = e.target.mostrarApelido.checked;

            if (usuariosExistentes.find(u => u.email === dados.email)) {
                alert("Este e-mail já está cadastrado.");
                return;
            }

            usuariosExistentes.push(dados);
            localStorage.setItem('@usuarios_viva', JSON.stringify(usuariosExistentes));
            localStorage.setItem('@usuario_logado', JSON.stringify(dados));
            alert(`Bem-vindo à família, ${dados.mostrarApelido ? dados.apelido : dados.nome}!`);
            navigate('/memorias');
        } else {
            const usuarioValido = usuariosExistentes.find(
                u => u.email === dados.email && u.senha === dados.senha
            );

            if (usuarioValido) {
                localStorage.setItem('@usuario_logado', JSON.stringify(usuarioValido));
                navigate('/memorias');
            } else {
                alert("E-mail ou senha incorretos.");
            }
        }
    };

    return (
        <>
            <Navbar />
            <main className="pagina-padrao" style={{ marginTop: '80px' }}>
                <div className="login-container-flex">
                    <section className="login-texto-chamada">
                        <h1 className="titulo-principal">Preservando o legado da sua família.</h1>
                        <p className="subtitulo-principal">O Memória Viva é um santuário digital para as histórias que moldaram quem somos.</p>

                        <div className="video-container-inicio">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/Ju9X2HMMid4"
                                title="video aleatorio"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ borderRadius: '16px' }}
                            ></iframe>
                        </div>
                    </section>

                    <section className="login-box">
                        <h2 className="login-titulo">{isCadastro ? "Criar Conta" : "Bem-vindo"}</h2>
                        <p className="login-subtitulo">
                            {isCadastro ? "Preencha os dados para participar." : "Acesse o santuário da sua família."}
                        </p>

                        <form onSubmit={handleAcao}>
                            {isCadastro && (
                                <div className="form-row">
                                    <div className="form-grupo">
                                        <label className="form-label">Nome</label>
                                        <input name="nome" type="text" className="form-input" required />
                                    </div>
                                    <div className="form-grupo">
                                        <label className="form-label">Sobrenome</label>
                                        <input name="sobrenome" type="text" className="form-input" required />
                                    </div>
                                </div>
                            )}

                            <div className="form-grupo">
                                <label className="form-label">E-mail</label>
                                <input name="email" type="email" className="form-input" placeholder="seu@email.com" required />
                            </div>

                            {isCadastro && (
                                <>
                                    <div className="form-grupo">
                                        <label className="form-label">Apelido de Família</label>
                                        <input name="apelido" type="text" className="form-input" placeholder="Como te chamam?" required />
                                    </div>
                                    <div className="form-check-grupo">
                                        <input type="checkbox" name="mostrarApelido" id="checkApelido" />
                                        <label htmlFor="checkApelido">Prefiro usar meu apelido no site</label>
                                    </div>
                                </>
                            )}

                            <div className="form-grupo">
                                <label className="form-label">Senha</label>
                                <input name="senha" type="password" className="form-input" placeholder="********" required />
                            </div>

                            <button type="submit" className="botao-primario btn-login" style={{ width: '100%' }}>
                                {isCadastro ? "Cadastrar" : "Entrar no Legado"}
                            </button>

                            <p className="alternar-login">
                                {isCadastro ? "Já faz parte?" : "Ainda não tem conta?"}
                                <button type="button" onClick={() => setIsCadastro(!isCadastro)}>
                                    {isCadastro ? "Faça Login" : "Cadastre-se"}
                                </button>
                            </p>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Inicio;