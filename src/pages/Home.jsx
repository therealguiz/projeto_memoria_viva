import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  const [modalAberto, setModalAberto] = useState(false);
  const [tipoMemoria, setTipoMemoria] = useState('foto');
  const [listaMemorias, setListaMemorias] = useState([]);
  const carrosselRef = useRef(null);

  const moverCarrossel = (direcao) => {
    if (carrosselRef.current) {
        const scrollAmount = 400;
        carrosselRef.current.scrollBy({
            left: direcao === 'esquerda' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    }
};

  useEffect(() => {
    const memoriasSalvas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
    setListaMemorias(memoriasSalvas);
  }, []);

  const lerArquivo = (arquivo) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(arquivo);
    });
  };

  const salvarNovaMemoria = async (evento) => {
    evento.preventDefault();
    const formData = new FormData(evento.target);
    const arquivo = formData.get('midia');
    const usuarioLogado = JSON.parse(localStorage.getItem('@usuario_logado'));
    let imagemFinal = "https://placehold.co/600x400/D1CFCB/3D3A3A?text=Sem+Foto";

    if (arquivo && arquivo.size > 0) {
      imagemFinal = await lerArquivo(arquivo);
    }

    const novaMemoria = {
      id: Date.now(),
      tipo: tipoMemoria,
      titulo: formData.get('titulo'),
      data: formData.get('data'),
      descricao: formData.get('descricao'),
      ingredientes: formData.get('ingredientes'),
      quemParticipa: formData.get('quemParticipa'),
      imagem: imagemFinal,
      curtidas: 0,
      autor: usuarioLogado ? (usuarioLogado.mostrarApelido ? usuarioLogado.apelido : usuarioLogado.nome) : "Anônimo",
      autorEmail: usuarioLogado?.email || ""
    };

    const memoriasSalvas = JSON.parse(localStorage.getItem('@memorias_familia')) || [];
    const novaLista = [novaMemoria, ...memoriasSalvas];

    localStorage.setItem('@memorias_familia', JSON.stringify(novaLista));
    setListaMemorias(novaLista);
    setModalAberto(false);
    setTipoMemoria('foto');
  };

  return (
    <>
      <Navbar aoClicarAdicionar={() => setModalAberto(true)} />

      <main className="pagina-padrao">
        <section className="trilho-memorias">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 className="titulo-trilho" style={{ margin: 0 }}>Novas Memórias</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => moverCarrossel('esquerda')}
                className="btn-scroll"
              >❮</button>
              <button
                onClick={() => moverCarrossel('direita')}
                className="btn-scroll"
              >❯</button>
            </div>
          </div>
          <div className="carrossel esconder-scroll" ref={carrosselRef}>
            {listaMemorias.length === 0 ? (
              <p style={{ color: '#888', padding: '20px' }}>
                Nenhuma memória guardada ainda. Clique em + para começar!
              </p>
            ) : (
              listaMemorias.map((memoria) => (
                <Link key={memoria.id} to={`/memoria/${memoria.id}`} className="card-memoria">
                  <div className="card-autor" style={{ fontSize: '11px', color: 'var(--cor-primaria)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Postado por: {memoria.autor}
                  </div>
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

      {modalAberto && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-box">
            <div className="modal-header">
              <h2 className="modal-titulo">
                {tipoMemoria === 'receita' ? 'Guardar Receita' :
                  tipoMemoria === 'historia' ? 'Contar História' : 'Guardar uma Memória'}
              </h2>
              <button className="btn-fechar" onClick={() => setModalAberto(false)}>&times;</button>
            </div>

            <form onSubmit={salvarNovaMemoria}>
              <div className="form-row">
                <div className="form-grupo">
                  <label className="form-label">Título</label>
                  <input name="titulo" type="text" className="form-input" placeholder="Ex: Natal de 2012" required />
                </div>
                <div className="form-grupo">
                  <label className="form-label">Data / Ano</label>
                  <input name="data" type="text" className="form-input" placeholder="Ex: 2018" required />
                </div>
              </div>

              <div className="form-grupo">
                <label className="form-label">O que você quer guardar?</label>
                <select
                  className="form-input"
                  value={tipoMemoria}
                  onChange={(e) => setTipoMemoria(e.target.value)}
                >
                  <option value="foto">Uma Foto ou Vídeo</option>
                  <option value="historia">Uma História</option>
                  <option value="receita">Uma Receita de Família</option>
                </select>
              </div>

              {tipoMemoria === 'receita' && (
                <div className="form-grupo">
                  <label className="form-label">Ingredientes</label>
                  <textarea name="ingredientes" className="form-input" rows="4" placeholder="- 2 xícaras de farinha"></textarea>
                </div>
              )}

              <div className="form-grupo">
                <label className="form-label">
                  {tipoMemoria === 'receita' ? 'Modo de Preparo' : 'A História'}
                </label>
                <textarea
                  name="descricao"
                  className="form-input"
                  rows={tipoMemoria === 'historia' ? 8 : 4}
                  placeholder="Conte os detalhes desse momento"
                  required
                ></textarea>
              </div>

              <div className="form-grupo">
                <label className="form-label">Quem participa?</label>
                <input name="quemParticipa" type="text" className="form-input" placeholder="Ex: vovó tal" />
              </div>

              <div className="form-grupo">
                <label className="form-label">Mídia (Opcional)</label>
                <div className="upload-box" onClick={() => document.getElementById('input-file').click()}>
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '5px' }}>📂</span>
                  <span className="upload-texto">Carregar arquivo do PC</span>
                  <input
                    id="input-file"
                    name="midia"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                <button type="submit" className="botao-primario btn-salvar">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;