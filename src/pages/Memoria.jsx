import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DetalheMemoria = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memoria, setMemoria] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [imagemComentario, setImagemComentario] = useState(null);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [dadosEditados, setDadosEditados] = useState({});

  const usuarioLogado = JSON.parse(localStorage.getItem('@usuario_logado'));

  useEffect(() => {
    const memoriasSalvas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
    const encontrada = memoriasSalvas.find(m => m.id === Number(id));
    setMemoria(encontrada);
  
    if (encontrada) {
      setDadosEditados({ ...encontrada });
    }
    
    const todosComentarios = JSON.parse(localStorage.getItem('@comentarios_memorias')) || {};
    setComentarios(todosComentarios[id] || []);
  }, [id]);

  const darLike = () => {
    const memoriasSalvas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
    const novasMemorias = memoriasSalvas.map(m => {
      if (m.id === Number(id)) {
        return { ...m, curtidas: (m.curtidas || 0) + 1 };
      }
      return m;
    });

    localStorage.setItem('@memorias_familia', JSON.stringify(novasMemorias));
    setMemoria(prev => ({ ...prev, curtidas: (prev.curtidas || 0) + 1 }));
  };

  const excluirMemoria = () => {
    if (window.confirm("Tem certeza que deseja apagar esta parte da história? Esta ação não pode ser desfeita.")) {
      const todas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
      const filtradas = todas.filter(m => m.id !== Number(id));
      
      localStorage.setItem('@memorias_familia', JSON.stringify(filtradas));

      const todosComents = JSON.parse(localStorage.getItem('@comentarios_memorias')) || {};
      delete todosComents[id];
      localStorage.setItem('@comentarios_memorias', JSON.stringify(todosComents));

      alert("Memória removida do legado.");
      navigate('/memorias');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDadosEditados(prev => ({ ...prev, [name]: value }));
  };

  const salvarEdicao = (e) => {
    e.preventDefault();
    const todas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
    const atualizadas = todas.map(m => m.id === Number(id) ? dadosEditados : m);
    
    localStorage.setItem('@memorias_familia', JSON.stringify(atualizadas));
    setMemoria({ ...dadosEditados });
    setModalEdicaoAberto(false);
    alert("História atualizada com sucesso!");
  };

  const manipularImagemComentario = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagemComentario(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const salvarComentario = (e) => {
    e.preventDefault();
    if (!novoComentario.trim() && !imagemComentario) return;

    const user = JSON.parse(localStorage.getItem('@usuario_logado')) || { nome: "Visitante", apelido: "Visitante", mostrarApelido: false };
    const nomeAutor = user.mostrarApelido ? user.apelido : user.nome;

    const comentarioObjeto = {
        id: Date.now(),
        autor: nomeAutor,
        texto: novoComentario,
        imagem: imagemComentario,
        data: new Date().toLocaleDateString()
    };

    const novosComentarios = [...comentarios, comentarioObjeto];
    setComentarios(novosComentarios);

    const todosComentarios = JSON.parse(localStorage.getItem('@comentarios_memorias')) || {};
    todosComentarios[id] = novosComentarios;
    localStorage.setItem('@comentarios_memorias', JSON.stringify(todosComentarios));

    setNovoComentario("");
    setImagemComentario(null);
  };

  if (!memoria) return null;

  return (
    <>
      <Navbar />
      <main className="pagina-padrao">
        <div style={{ marginTop: '30px', paddingLeft: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '20px' }}>
          <Link to="/memorias" style={{ color: '#888', fontSize: '14px' }}>← Voltar para o feed</Link>
          {usuarioLogado && usuarioLogado.email === memoria.autorEmail && (
              <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-editar-mini" onClick={() => setModalEdicaoAberto(true)}>
                      Editar
                  </button>
                  <button className="btn-excluir-mini" onClick={excluirMemoria}>
                      Excluir
                  </button>
              </div>
          )}
        </div>

        <div className="container-detalhe" style={{ gridTemplateColumns: '1fr' }}>
          <section className="memoria-principal">
            <div className="memoria-cabecalho" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 className="titulo-memoria">{memoria.titulo}</h1>
                <p className="data-post">Escrito por: <strong>{memoria.autor}</strong> em {memoria.data}</p>
              </div>

              <button onClick={darLike} className="btn-like">
                ❤️ {memoria.curtidas || 0} Curtidas
              </button>
            </div>

            {memoria.imagem && memoria.imagem !== "https://placehold.co/600x400/D1CFCB/3D3A3A?text=Sem+Foto" && (
              <div className="memoria-midia">
                <img src={memoria.imagem} alt="Principal" />
              </div>
            )}

            <div className="memoria-texto">
              {memoria.tipo === 'receita' && (
                <div style={{ marginBottom: '30px', padding: '25px', background: '#fffbf0', borderRadius: '12px', borderLeft: '5px solid var(--cor-primaria)' }}>
                  <h3 style={{ fontFamily: 'var(--fonte-titulo)', color: 'var(--cor-primaria)', marginTop: 0 }}>Ingredientes</h3>
                  <p style={{ whiteSpace: 'pre-line', fontStyle: 'italic' }}>{memoria.ingredientes}</p>
                </div>
              )}

              <h3 style={{ fontFamily: 'var(--fonte-titulo)', color: 'var(--cor-primaria)' }}>
                {memoria.tipo === 'receita' ? 'Modo de Preparo' : 'A História'}
              </h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{memoria.descricao}</p>
            </div>

            {memoria.quemParticipa && (
              <div style={{ marginTop: '20px', padding: '15px', borderTop: '1px solid #eee' }}>
                <span style={{ color: 'var(--cor-primaria)', fontWeight: 'bold' }}>Participantes: </span>
                <span>{memoria.quemParticipa}</span>
              </div>
            )}
            <div className="fio-historia" style={{ marginTop: '50px', borderTop: '2px dashed #EAE8E4' }}>
              <h3 className="fio-titulo">Fio da História</h3>

              <div className="lista-comentarios">
                {comentarios.length === 0 ? (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>Nenhum detalhe adicionado ainda. Seja o primeiro!</p>
                ) : (
                  comentarios.map(coment => (
                    <div key={coment.id} className="item-fio">
                      <h4>
                        <span>{coment.autor}:</span>
                        <span className="badge-fio">{coment.data}</span>
                      </h4>
                      {coment.imagem && (
                        <img src={coment.imagem} alt="Anexo" className="img-preview-comentario" style={{ width: '100%', maxWidth: '300px', height: 'auto', marginBottom: '10px' }} />
                      )}
                      <p>{coment.texto}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={salvarComentario} className="area-comentarios" style={{ marginTop: '40px' }}>
                <textarea
                  className="form-input"
                  placeholder="Adicione um detalhe ou comentário a esta história"
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  rows="3"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ cursor: 'pointer', color: 'var(--cor-primaria)', fontSize: '14px', fontWeight: '500' }}>
                      Anexar Foto
                      <input type="file" accept="image/*" onChange={manipularImagemComentario} style={{ display: 'none' }} />
                    </label>
                    {imagemComentario && <span style={{ fontSize: '12px', color: '#27ae60' }}>Foto carregada</span>}
                  </div>
                  <button type="submit" className="botao-primario">Postar no Fio</button>
                </div>
                {imagemComentario && (
                  <img src={imagemComentario} alt="Preview" style={{ height: '80px', marginTop: '15px', borderRadius: '8px', border: '2px solid var(--cor-primaria)' }} />
                )}
              </form>
            </div>
          </section>
        </div>
        {modalEdicaoAberto && (
          <div className="modal-overlay" style={{ display: 'flex' }}>
            <div className="modal-box">
              <div className="modal-header">
                <h2 className="modal-titulo">Editar Detalhes</h2>
                <button className="btn-fechar" onClick={() => setModalEdicaoAberto(false)}>&times;</button>
              </div>
              <form onSubmit={salvarEdicao}>
                <div className="form-row">
                  <div className="form-grupo">
                    <label className="form-label">Título</label>
                    <input 
                      name="titulo" 
                      type="text" 
                      className="form-input" 
                      value={dadosEditados.titulo || ""} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-grupo">
                    <label className="form-label">Data / Ano</label>
                    <input 
                      name="data" 
                      type="text" 
                      className="form-input" 
                      value={dadosEditados.data || ""} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                </div>

                {memoria.tipo === 'receita' && (
                  <div className="form-grupo">
                    <label className="form-label">Ingredientes</label>
                    <textarea 
                      name="ingredientes" 
                      className="form-input" 
                      rows="4" 
                      value={dadosEditados.ingredientes || ""} 
                      onChange={handleInputChange} 
                    />
                  </div>
                )}

                <div className="form-grupo">
                  <label className="form-label">
                    {memoria.tipo === 'receita' ? 'Modo de Preparo' : 'A História'}
                  </label>
                  <textarea 
                    name="descricao" 
                    className="form-input" 
                    rows="6" 
                    value={dadosEditados.descricao || ""} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>

                <div className="form-grupo">
                  <label className="form-label">Quem participa?</label>
                  <input 
                    name="quemParticipa" 
                    type="text" 
                    className="form-input" 
                    value={dadosEditados.quemParticipa || ""} 
                    onChange={handleInputChange} 
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancelar" onClick={() => setModalEdicaoAberto(false)}>Cancelar</button>
                  <button type="submit" className="botao-primario">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default DetalheMemoria;