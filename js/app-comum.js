// Topo comum às páginas: navegação, estado de gravação e diálogo "Ligar ao GitHub".
(function () {
  var REPO = "mendesmaya/acad-dashboard";
  var TEXTOS = {
    "sem-token": "Só neste dispositivo (liga o token para guardar no GitHub)",
    "a-guardar": "A guardar…",
    guardado: "Guardado no GitHub",
    erro: "Erro ao guardar: a alteração fica neste dispositivo",
    conflito: "Há alterações mais recentes no GitHub: recarrega a página",
    ligado: "Ligado ao GitHub",
  };

  function iniciar(opts) {
    var armazem = Armazem.criar({ repo: REPO, branch: "main", storage: window.localStorage });
    var topo = document.getElementById("topo");
    var link = function (href, txt, id) { return '<a href="' + href + '"' + (opts.pagina === id ? ' class="on" aria-current="page"' : "") + ">" + txt + "</a>"; };
    topo.innerHTML =
      '<nav aria-label="Páginas">' + link("index.html", "Calendário", "calendario") + link("notas.html", "Notas", "notas") + "</nav>" +
      '<div class="estado"><span id="estado-guardar" role="status" aria-live="polite"></span><button class="ghost" id="btn-ligar" type="button"></button></div>' +
      '<dialog id="dlg-ligar"><form method="dialog" class="dlg">' +
      "<h2>Ligar ao GitHub</h2>" +
      "<p>Para as alterações ficarem guardadas no repositório, cria um token pessoal só para este repositório:</p>" +
      "<ol><li>GitHub → Settings → Developer settings → Personal access tokens → <b>Fine-grained tokens</b> → Generate new token.</li>" +
      "<li><b>Repository access</b>: Only select repositories → <b>acad-dashboard</b>.</li>" +
      "<li><b>Permissions → Contents: Read and write</b>.</li>" +
      "<li>Copia o token e cola-o abaixo. Fica <b>só neste browser</b> (nunca no repositório).</li></ol>" +
      '<label for="tok">Token</label><input id="tok" type="password" autocomplete="off" placeholder="github_pat_…">' +
      '<div class="dlg-botoes"><button class="primary" id="tok-guardar" value="guardar">Guardar token</button><button id="tok-remover" value="remover" type="submit">Remover token</button><button value="fechar">Fechar</button></div>' +
      "</form></dialog>";

    var estadoEl = document.getElementById("estado-guardar"), btn = document.getElementById("btn-ligar"), dlg = document.getElementById("dlg-ligar");
    function mostrar(e) { estadoEl.textContent = TEXTOS[e] || ""; estadoEl.dataset.estado = e; }
    function atualizarBotao() { btn.textContent = armazem.temToken() ? "Token ligado ✓" : "Ligar ao GitHub"; mostrar(armazem.temToken() ? "ligado" : "sem-token"); }
    atualizarBotao();
    armazem.aoMudarEstado(function (e) { mostrar(e); });
    btn.addEventListener("click", function () { document.getElementById("tok").value = ""; dlg.showModal(); });
    dlg.addEventListener("close", function () {
      var v = dlg.returnValue, tok = document.getElementById("tok").value.trim();
      if (v === "guardar" && tok) { armazem.definirToken(tok); atualizarBotao(); }
      else if (v === "remover") { armazem.removerToken(); atualizarBotao(); }
      document.getElementById("tok").value = "";
    });
    return armazem;
  }

  window.AppComum = { iniciar: iniciar };
})();
