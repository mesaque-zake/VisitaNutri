const { useState, useEffect } = React;

// --- DADOS INICIAIS (Se não houver nada no Cache) ---
const INITIAL_INST = ["2 - OBRA SOCIAL DOM BOSCO", "6 - CEC TABOR", "9 - CCA VILA PEDREIRA", "10 - CCA SANTA TEREZINHA"]; // Resumido para o exemplo, você pode colar a lista inteira aqui depois

const initForm = () => ({
  id: Date.now(),
  instituicao: "", atendidoPor: "", quemRecebeu: "", cargo: "", numAtendidos: "",
  alimentos: [], sobras: "", convenio: "", refeicoes: [], prioridadeDoacao: "",
  equipamentos: { geladeiraDom: "", geladeiraInd: "", fogaoQtd: "", freezerQtd: "", camaraFria: "", fornoComum: "", outros: "" },
  caracCozinha: [], funcCozinheira: "", funcAuxiliar: "",
  higiene: { geral: "", manipuladores: [], aplicadas: "" },
  orientacoesRapidas: [], orientacoesNutricionista: "", data: new Date().toLocaleDateString("pt-BR"),
});

function App() {
  // Estados Globais
  const [activeMenu, setActiveMenu] = useState("nova"); // "nova", "historico", "instituicoes"
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("mb_visita_rascunho");
    return saved ? JSON.parse(saved) : initForm();
  });
  const [step, setStep] = useState(0);

  // Auto-Save: Toda vez que 'form' muda, salva no rascunho
  useEffect(() => {
    localStorage.setItem("mb_visita_rascunho", JSON.stringify(form));
  }, [form]);

  // Funções de Update do Formulário (Helpers)
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const tog = (k, v) => setForm(f => ({ ...f, [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] }));
  
  // ==========================================
  // COMPONENTE: LAYOUT DA SIDEBAR (Desktop) E BOTTOM BAR (Mobile)
  // ==========================================
  const Sidebar = () => (
    <div className="group w-16 hover:w-64 transition-all duration-300 bg-mb-green text-white flex-col justify-between hidden md:flex h-full shadow-2xl z-50">
      <div>
        {/* Topo: Ícone e Título */}
        <div className="h-16 flex items-center px-4 border-b border-white/10 bg-mb-green-mid/30">
          <i className="ti ti-leaf text-2xl shrink-0"></i>
          <span className="sidebar-text-expand font-semibold tracking-wide">Visitas Nutricionais</span>
        </div>

        {/* Menu do Meio */}
        <nav className="mt-6 flex flex-col gap-2 px-2">
          <MenuBtn id="nova" icon="clipboard-plus" text="Nova Visita" />
          <MenuBtn id="historico" icon="history" text="Histórico (7 dias)" />
          <MenuBtn id="instituicoes" icon="building-cog" text="Gerenciar Instituições" />
        </nav>
      </div>

      {/* Rodapé: Powered by */}
      <div className="mb-6 px-4 flex items-center text-white/50 hover:text-white/80 cursor-default">
        <i className="ti ti-code text-xl shrink-0"></i>
        <span className="sidebar-text-expand text-xs whitespace-nowrap">
          Powered by Mesaque & Lorrana
        </span>
      </div>
    </div>
  );

  const MenuBtn = ({ id, icon, text }) => (
    <button 
      onClick={() => setActiveMenu(id)}
      className={`flex items-center w-full px-3 py-3 rounded-lg transition-colors ${activeMenu === id ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white/70'}`}
    >
      <i className={`ti ti-${icon} text-xl shrink-0`}></i>
      <span className="sidebar-text-expand text-sm">{text}</span>
    </button>
  );

  const MobileNav = () => (
    <div className="md:hidden flex w-full h-16 bg-white border-t border-gray-200 justify-around items-center text-gray-500 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <MobBtn id="nova" icon="clipboard-plus" text="Nova" />
      <MobBtn id="historico" icon="history" text="Histórico" />
      <MobBtn id="instituicoes" icon="building-cog" text="Locais" />
    </div>
  );

  const MobBtn = ({ id, icon, text }) => (
    <button onClick={() => setActiveMenu(id)} className={`flex flex-col items-center justify-center w-full h-full ${activeMenu === id ? 'text-mb-green' : ''}`}>
      <i className={`ti ti-${icon} text-xl mb-1`}></i>
      <span className="text-[10px] font-medium">{text}</span>
    </button>
  );

  // ==========================================
  // COMPONENTE: NOVA VISITA (WIZARD DE 3 PASSOS)
  // ==========================================
  const renderStep = () => {
    if (step === 0) return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-mb-green border-b pb-2">1. Identificação & Alimentação</h3>
        {/* Instituição e quem recebeu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Instituição</label>
              <input type="text" className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mb-green focus:border-mb-green outline-none transition-all" placeholder="Selecione..." value={form.instituicao} onChange={e => upd('instituicao', e.target.value)} />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Quem recebeu (Nome / Cargo)</label>
              <input type="text" className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mb-green outline-none transition-all" placeholder="Ex: Maria - Cozinheira" value={form.quemRecebeu} onChange={e => upd('quemRecebeu', e.target.value)} />
           </div>
        </div>
        {/* Alimentos Necessários */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Alimentos mais necessários</label>
          <div className="flex flex-wrap gap-2">
            {['FLV', 'Pães', 'Cesta básica', 'Carnes', 'Laticínios'].map(a => (
              <button key={a} onClick={() => tog('alimentos', a)} className={`px-4 py-1.5 rounded-full text-sm border transition-all ${form.alimentos.includes(a) ? 'bg-mb-green-light border-mb-green text-mb-green font-medium' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    );

    if (step === 1) return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-amber-600 border-b border-amber-200 pb-2">2. Equipamentos & Infraestrutura</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Geladeiras (Qtd)</label>
             <input type="number" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={form.equipamentos.geladeiraDom} onChange={e => upd('equipamentos', {...form.equipamentos, geladeiraDom: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Fogão (Qtd)</label>
             <input type="number" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={form.equipamentos.fogaoQtd} onChange={e => upd('equipamentos', {...form.equipamentos, fogaoQtd: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Freezer (Qtd)</label>
             <input type="number" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={form.equipamentos.freezerQtd} onChange={e => upd('equipamentos', {...form.equipamentos, freezerQtd: e.target.value})} />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Fornos (Qtd)</label>
             <input type="number" className="w-full p-2.5 rounded-lg border border-gray-300 outline-none" value={form.equipamentos.fornoComum} onChange={e => upd('equipamentos', {...form.equipamentos, fornoComum: e.target.value})} />
           </div>
        </div>
      </div>
    );

    if (step === 2) return (
      <div className="space-y-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-blue-600 border-b border-blue-200 pb-2">3. Higiene & Orientações</h3>
        
        {/* Modificador S-PEN (Expande a tela) */}
        <div className="bg-white p-4 rounded-xl border shadow-sm">
           <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">Observações da Nutricionista</label>
              <button 
                onClick={() => document.getElementById('spen-modal').classList.remove('hidden')}
                className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
              >
                <i className="ti ti-ballpen"></i> Modo Escrita S-Pen
              </button>
           </div>
           <textarea 
             className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-mb-green outline-none" 
             rows="4" 
             placeholder="Digite ou clique no botão acima para usar o modo manuscrito no tablet..."
             value={form.orientacoesNutricionista}
             onChange={e => upd('orientacoesNutricionista', e.target.value)}
           ></textarea>
        </div>
      </div>
    );
  };

  const clearAndStartOver = () => {
    if(confirm("Deseja apagar o rascunho atual e iniciar uma nova visita?")) {
      setForm(initForm());
      setStep(0);
    }
  }

  // ==========================================
  // RENDERIZAÇÃO PRINCIPAL DO APP
  // ==========================================
  return (
    <div className="flex h-screen w-full bg-gray-50">
      
      {/* Sidebar Desktop */}
      <Sidebar />

      {/* Área Central Principal */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Header Superior Mobile (Mostra só em telas pequenas) */}
        <div className="md:hidden bg-mb-green text-white p-4 shadow-md flex items-center justify-between z-10">
           <div className="flex items-center gap-2">
             <i className="ti ti-leaf text-xl"></i>
             <h1 className="font-semibold">Mesa Brasil</h1>
           </div>
        </div>

        {/* Corpo de Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            
            {/* TELA: NOVA VISITA */}
            {activeMenu === 'nova' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                
                {/* Indicador de Passos */}
                <div className="flex border-b bg-gray-50/50">
                  {['Geral', 'Infra', 'Orientações'].map((st, i) => (
                    <button key={i} onClick={() => setStep(i)} className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${step === i ? 'border-mb-green text-mb-green bg-white' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                      {i+1}. {st}
                    </button>
                  ))}
                </div>
                
                <div className="p-6 md:p-8">
                  {renderStep()}
                </div>

                {/* Botões de Navegação */}
                <div className="bg-gray-50 p-4 border-t flex justify-between items-center rounded-b-2xl">
                  {step > 0 ? (
                    <button onClick={() => setStep(s => s - 1)} className="px-5 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                      <i className="ti ti-arrow-left"></i> Voltar
                    </button>
                  ) : (
                    <button onClick={clearAndStartOver} className="px-5 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-all text-sm">
                      Limpar Form
                    </button>
                  )}

                  {step < 2 ? (
                    <button onClick={() => setStep(s => s + 1)} className="px-5 py-2 bg-mb-green text-white rounded-lg shadow-md hover:bg-mb-green-mid transition-all flex items-center gap-2">
                      Próximo <i className="ti ti-arrow-right"></i>
                    </button>
                  ) : (
                    <button onClick={() => alert("Função de Salvar no Histórico virá na V2!")} className="px-6 py-2 bg-mb-orange text-white rounded-lg shadow-lg hover:bg-orange-600 transition-all flex items-center gap-2 font-medium">
                      <i className="ti ti-check"></i> Finalizar Relatório
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TELAS PLACEHOLDERS (Histórico e Instituições) */}
            {activeMenu === 'historico' && (
              <div className="text-center py-20 text-gray-500">
                 <i className="ti ti-history text-5xl mb-4 text-gray-300"></i>
                 <h2 className="text-xl font-medium text-gray-700">Histórico de Visitas</h2>
                 <p className="mt-2">Suas visitas finalizadas nos últimos 7 dias aparecerão aqui.</p>
              </div>
            )}

            {activeMenu === 'instituicoes' && (
              <div className="text-center py-20 text-gray-500">
                 <i className="ti ti-building text-5xl mb-4 text-gray-300"></i>
                 <h2 className="text-xl font-medium text-gray-700">Gerenciador de Locais</h2>
                 <p className="mt-2">Aqui você poderá adicionar ou editar a lista de instituições.</p>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Bottom Nav Mobile */}
      <MobileNav />

      {/* =========================================
          MODAL S-PEN (Fundo Desfocado, Cobre a tela)
          ========================================= */}
      <div id="spen-modal" className="hidden fixed inset-0 z-[100] bg-black/40 spen-modal-open flex items-center justify-center p-4 md:p-10">
        <div className="bg-white w-full h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in border-4 border-blue-100">
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
             <div className="flex items-center gap-2">
                <i className="ti ti-ballpen text-2xl"></i>
                <h3 className="font-semibold text-lg">Modo Escrita - Tablet</h3>
             </div>
             <button onClick={() => document.getElementById('spen-modal').classList.add('hidden')} className="text-white hover:text-blue-200">
                <i className="ti ti-x text-2xl"></i>
             </button>
          </div>
          <div className="p-4 bg-yellow-50 text-yellow-800 text-sm flex items-center gap-2 border-b border-yellow-200">
             <i className="ti ti-info-circle"></i>
             Toque com sua S-Pen ou Apple Pencil no quadro abaixo para escrever livremente.
          </div>
          <textarea 
             className="flex-1 w-full p-6 text-lg outline-none resize-none bg-repeat"
             style={{ backgroundImage: 'linear-gradient(transparent, transparent 29px, #e5e7eb 30px)', backgroundSize: '100% 30px', lineHeight: '30px' }}
             value={form.orientacoesNutricionista}
             onChange={e => upd('orientacoesNutricionista', e.target.value)}
             placeholder="Comece a escrever aqui..."
          ></textarea>
          <div className="p-4 bg-gray-50 border-t flex justify-end">
            <button onClick={() => document.getElementById('spen-modal').classList.add('hidden')} className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow font-medium">
               Concluído
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
