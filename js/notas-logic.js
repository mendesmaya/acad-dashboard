// Cálculos puros (sem DOM). Média simples das notas arredondadas (0–20).
(function () {
  var ESTADOS = ["com-nota", "terminado", "por-cursar"];
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  function arredondar(x) {
    // x,5 sobe (18,5 → 19); a margem evita erros de vírgula flutuante
    return Math.floor(x + 0.5 + 1e-9);
  }

  // Aceita número ou texto com vírgula. Devolve inteiro 0–20 ou null.
  function normalizarNota(valor) {
    if (valor === null || valor === undefined) return null;
    var v = valor;
    if (typeof v === "string") {
      v = v.trim().replace(",", ".");
      if (v === "") return null;
      v = Number(v);
    }
    if (typeof v !== "number" || !isFinite(v)) return null;
    if (v < 0 || v > 20) return null;
    return arredondar(v);
  }

  function resumo(notas) {
    if (notas.length === 0) return null;
    var soma = 0;
    for (var i = 0; i < notas.length; i++) soma += notas[i];
    var decimal = soma / notas.length;
    return { decimal: decimal, arredondada: arredondar(decimal), n: notas.length };
  }

  function notasOficiais(modulos) {
    var r = [];
    for (var i = 0; i < modulos.length; i++) {
      var m = modulos[i];
      if (m.estado !== "com-nota") continue;
      var n = normalizarNota(m.nota);
      if (n !== null) r.push(n);
    }
    return r;
  }

  function mediaBloco(modulos) {
    return resumo(notasOficiais(modulos));
  }

  function mediaProjetada(modulos) {
    var notas = notasOficiais(modulos);
    for (var i = 0; i < modulos.length; i++) {
      var m = modulos[i];
      if (m.estado !== "terminado") continue;
      var p = normalizarNota(m.provisoria);
      if (p !== null) notas.push(p);
    }
    return resumo(notas);
  }

  // Nota média (inteira) a tirar nos módulos que ainda não têm nota oficial
  // para a média arredondada final ser >= alvo.
  function necessarioParaMedia(modulos, alvo) {
    var oficiais = notasOficiais(modulos);
    var soma = 0;
    for (var i = 0; i < oficiais.length; i++) soma += oficiais[i];
    var restantes = modulos.length - oficiais.length;
    if (restantes === 0) {
      var atual = resumo(oficiais);
      return { possivel: !!atual && atual.arredondada >= alvo, notaMediaNecessaria: null, restantes: 0 };
    }
    for (var x = 0; x <= 20; x++) {
      if (arredondar((soma + restantes * x) / modulos.length) >= alvo) {
        return { possivel: true, notaMediaNecessaria: x, restantes: restantes };
      }
    }
    return { possivel: false, notaMediaNecessaria: null, restantes: restantes };
  }

  // Média final se todos os módulos sem nota oficial tirarem x.
  function mediaSeTirar(modulos, x) {
    var nx = normalizarNota(x);
    if (nx === null || modulos.length === 0) return null;
    var oficiais = notasOficiais(modulos), soma = 0;
    for (var i = 0; i < oficiais.length; i++) soma += oficiais[i];
    soma += (modulos.length - oficiais.length) * nx;
    var decimal = soma / modulos.length;
    return { decimal: decimal, arredondada: arredondar(decimal), n: modulos.length };
  }

  // Folga face aos limiares de arredondamento (x,5).
  function margemLimiares(media) {
    if (typeof media !== "number" || !isFinite(media)) return null;
    var r = arredondar(media);
    return {
      arredondada: r,
      acima: media - (r - 0.5),
      falta: r < 20 ? (r + 0.5) - media : null,
      seguinte: r < 20 ? r + 1 : null,
    };
  }

  // Média acumulada por módulo concluído, pela ordem em que os módulos terminam no cronograma.
  function evolucao(modulos) {
    var lista = [];
    for (var i = 0; i < modulos.length; i++) {
      var m = modulos[i];
      if (m.estado !== "com-nota") continue;
      var n = normalizarNota(m.nota);
      if (n !== null) lista.push({ codigo: m.codigo, nota: n, fim: m.fim || "9999-12-31", ord: i });
    }
    lista.sort(function (a, b) { return a.fim < b.fim ? -1 : a.fim > b.fim ? 1 : a.ord - b.ord; });
    var soma = 0;
    return lista.map(function (e, k) {
      soma += e.nota;
      return { codigo: e.codigo, nota: e.nota, media: soma / (k + 1) };
    });
  }

  function distribuicao(modulos) {
    var d = {}, notas = notasOficiais(modulos);
    for (var i = 0; i < notas.length; i++) d[notas[i]] = (d[notas[i]] || 0) + 1;
    return d;
  }

  function semAcentos(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  // Pesquisa por código ou palavras do nome (sem acentos nem maiúsculas).
  function procurarModulos(modulos, texto, limite) {
    var q = semAcentos(texto || "").trim();
    if (!q) return [];
    var palavras = q.split(/\s+/), r = [];
    for (var i = 0; i < modulos.length; i++) {
      var m = modulos[i], alvo = semAcentos(m.codigo + " " + m.nome), ok = true;
      for (var k = 0; k < palavras.length; k++) if (alvo.indexOf(palavras[k]) < 0) { ok = false; break; }
      if (ok) r.push({ m: m, porCodigo: semAcentos(m.codigo).indexOf(q) >= 0 ? 0 : 1, i: i });
    }
    r.sort(function (a, b) { return a.porCodigo - b.porCodigo || a.i - b.i; });
    return r.slice(0, limite || 8).map(function (x) { return x.m; });
  }

  // hoje: "AAAA-MM-DD". Devolve "futuro" | "a-decorrer" | "terminou" | null (sem datas).
  function estadoTemporal(m, hoje) {
    if (!m || !m.inicio || !m.fim) return null;
    if (hoje < m.inicio) return "futuro";
    if (hoje > m.fim) return "terminou";
    return "a-decorrer";
  }

  function formatarData(iso, hoje) {
    if (!iso) return "";
    var p = String(iso).split("-");
    var txt = Number(p[2]) + " " + MESES[Number(p[1]) - 1];
    return p[0] !== String(hoje).split("-")[0] ? txt + " " + p[0] : txt;
  }

  function formatar(n) {
    if (typeof n !== "number" || !isFinite(n)) return "—";
    return n.toFixed(2).replace(".", ",");
  }

  // Aplica notas guardadas (ou de um backup) sobre os módulos base. Ignora tudo o que for inválido.
  function aplicarGuardado(baseCet, guardados) {
    var base = JSON.parse(JSON.stringify(baseCet));
    if (!Array.isArray(guardados)) return base;
    var porCod = {};
    guardados.forEach(function (g) { if (g && typeof g === "object" && typeof g.codigo === "string") porCod[g.codigo] = g; });
    base.forEach(function (m) {
      var q = porCod[m.codigo];
      if (!q || ESTADOS.indexOf(q.estado) < 0) return;
      var nota = normalizarNota(q.nota);
      if (q.estado === "com-nota" && nota === null) return;
      var dec = (typeof q.notaDecimal === "number" && isFinite(q.notaDecimal) && q.notaDecimal >= 0 && q.notaDecimal <= 20) ? q.notaDecimal : null;
      m.estado = q.estado;
      m.nota = q.estado === "com-nota" ? nota : null;
      m.notaDecimal = q.estado === "com-nota" ? dec : null;
      m.provisoria = q.estado === "terminado" ? normalizarNota(q.provisoria) : null;
    });
    return base;
  }

  // Aplica notas do PRI (lista { codigo, nota, notaDecimal }) sobre os módulos base do PRI.
  function aplicarPri(basePri, guardados) {
    var base = JSON.parse(JSON.stringify(basePri));
    if (!Array.isArray(guardados)) return base;
    var porCod = {};
    guardados.forEach(function (g) { if (g && typeof g === "object" && typeof g.codigo === "string") porCod[g.codigo] = g; });
    base.forEach(function (m) {
      var q = porCod[m.codigo];
      if (!q) return;
      var nota = normalizarNota(q.nota);
      if (nota === null) return;
      var dec = (typeof q.notaDecimal === "number" && isFinite(q.notaDecimal) && q.notaDecimal >= 0 && q.notaDecimal <= 20) ? q.notaDecimal : null;
      m.estado = "com-nota"; m.nota = nota; m.notaDecimal = dec;
    });
    return base;
  }

  function exportar(estado) {
    return JSON.stringify({
      versao: 1,
      exportadoEm: new Date().toISOString(),
      alvo: estado.alvo,
      cet: estado.cet.map(function (m) {
        return { codigo: m.codigo, estado: m.estado, nota: m.nota, notaDecimal: m.notaDecimal, provisoria: m.provisoria };
      }),
      pri: (estado.pri || []).filter(function (m) { return m.estado === "com-nota"; }).map(function (m) {
        return { codigo: m.codigo, nota: m.nota, notaDecimal: m.notaDecimal };
      }),
    }, null, 2);
  }

  // Devolve { cet, alvo, pri } ou null se o texto não for um backup válido.
  // basePri (opcional): módulos base do PRI sobre os quais aplicar as notas do backup.
  function importar(texto, baseCet, basePri) {
    var o;
    try { o = JSON.parse(texto); } catch (e) { return null; }
    if (!o || typeof o !== "object" || o.versao !== 1 || !Array.isArray(o.cet)) return null;
    return {
      cet: aplicarGuardado(baseCet, o.cet),
      alvo: [18, 19, 20].indexOf(o.alvo) >= 0 ? o.alvo : 19,
      pri: basePri ? aplicarPri(basePri, o.pri) : [],
    };
  }

  window.Notas = {
    normalizarNota: normalizarNota,
    mediaBloco: mediaBloco,
    mediaProjetada: mediaProjetada,
    necessarioParaMedia: necessarioParaMedia,
    mediaSeTirar: mediaSeTirar,
    margemLimiares: margemLimiares,
    evolucao: evolucao,
    distribuicao: distribuicao,
    procurarModulos: procurarModulos,
    estadoTemporal: estadoTemporal,
    formatarData: formatarData,
    formatar: formatar,
    aplicarGuardado: aplicarGuardado,
    aplicarPri: aplicarPri,
    exportar: exportar,
    importar: importar,
  };
})();
