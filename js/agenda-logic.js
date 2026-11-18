// Lógica pura do calendário (sem DOM). Datas em "AAAA-MM-DD", horas em "HH:MM".
(function () {
  var TIPOS = ["trabalho", "teste", "quiz", "entrega", "outro"];

  function pad(n) { return String(n).padStart(2, "0"); }
  function iso(d) { return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function paraData(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function somarDias(s, n) { var d = paraData(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); }
  function diaSemana(s) { return (paraData(s).getUTCDay() + 6) % 7; } // 0 = segunda
  function segundaDaSemana(s) { return somarDias(s, -diaSemana(s)); }
  function dataValida(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && iso(paraData(s)) === s; }
  function horaValida(h) { return h === "" || h === undefined || h === null || /^([01]\d|2[0-3]):[0-5]\d$/.test(h); }
  function horaParaMin(h) { var p = h.split(":"); return +p[0] * 60 + +p[1]; }

  // Semanas (arrays de 7 datas, a começar à segunda) que cobrem o mês.
  function gradeMes(ano, mes) {
    var alvo = ano + "-" + pad(mes), cur = segundaDaSemana(alvo + "-01"), semanas = [];
    do {
      var w = [];
      for (var i = 0; i < 7; i++) { w.push(cur); cur = somarDias(cur, 1); }
      semanas.push(w);
    } while (cur.slice(0, 7) <= alvo);
    return semanas;
  }

  function pascoa(ano) {
    var a = ano % 19, b = Math.floor(ano / 100), c = ano % 100, d = Math.floor(b / 4), e = b % 4;
    var f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return ano + "-" + pad(mes) + "-" + pad(dia);
  }

  // Feriados nacionais (fixos e móveis) + municipal de Matosinhos.
  function feriadosDoAno(ano) {
    var p = pascoa(ano), y = String(ano);
    var lista = [
      [y + "-01-01", "Dia de Ano Novo"], [somarDias(p, -47), "Carnaval"], [somarDias(p, -2), "Sexta-Feira Santa"], [p, "Páscoa"],
      [y + "-04-25", "Dia da Liberdade"], [y + "-05-01", "Dia do Trabalhador"], [y + "-05-26", "Feriado Municipal de Matosinhos"],
      [somarDias(p, 60), "Corpo de Deus"], [y + "-06-10", "Dia de Portugal"], [y + "-08-15", "Assunção de Nossa Senhora"],
      [y + "-10-05", "Implantação da República"], [y + "-11-01", "Dia de Todos os Santos"], [y + "-12-01", "Restauração da Independência"],
      [y + "-12-08", "Dia da Imaculada Conceição"], [y + "-12-25", "Natal"],
    ];
    return lista.map(function (x) { return { data: x[0], nome: x[1] }; }).sort(function (a, b) { return a.data < b.data ? -1 : 1; });
  }

  function feriadoDoDia(cal, d) {
    var i, lista = (cal && cal.feriados) || [];
    for (i = 0; i < lista.length; i++) if (lista[i].data === d) return lista[i];
    var ano = Number(d.slice(0, 4)), temAno = lista.some(function (x) { return x.data.slice(0, 4) === d.slice(0, 4); });
    if (!temAno) { var calc = feriadosDoAno(ano); for (i = 0; i < calc.length; i++) if (calc[i].data === d) return calc[i]; }
    return null;
  }
  function feriasDoDia(cal, d) {
    var lista = (cal && cal.ferias) || [];
    for (var i = 0; i < lista.length; i++) if (d >= lista[i].inicio && d <= lista[i].fim) return lista[i];
    return null;
  }

  // Faixas do cronograma → sessões. Só se juntam as faixas 1+2 e 3+4 do mesmo módulo (nunca através do intervalo).
  function sessoesPrevistas(aulas, faixas, d) {
    var slots = aulas && aulas[d], r = [];
    if (!slots) return r;
    [[0, 1], [2, 3]].forEach(function (par) {
      var a = slots[par[0]], b = slots[par[1]];
      function sessao(i, f, uc) { return { id: d + "-" + faixas[i][0].replace(":", "") + "-p", data: d, inicio: faixas[i][0], fim: faixas[f][1], uc: uc, local: "", formador: "", previsto: true }; }
      if (a && a === b) r.push(sessao(par[0], par[1], a));
      else { if (a) r.push(sessao(par[0], par[0], a)); if (b) r.push(sessao(par[1], par[1], b)); }
    });
    return r;
  }

  function ordenarSessoes(l) { return l.sort(function (a, b) { return a.data === b.data ? (a.inicio < b.inicio ? -1 : a.inicio > b.inicio ? 1 : 0) : (a.data < b.data ? -1 : 1); }); }

  // Prioridade: edição à mão > horario.json > previsão do cronograma.
  function sessoesDaSemana(segunda, ctx) {
    var edit = ctx.edits && ctx.edits[segunda], sem = ctx.horario && ctx.horario.semanas && ctx.horario.semanas[segunda];
    var maisNovo = !!(edit && sem && (sem.atualizadoEm || "") > (edit.baseAtualizadoEm || ""));
    if (edit) return { origem: "edicao", ficheiroMaisNovo: maisNovo, sessoes: ordenarSessoes(JSON.parse(JSON.stringify(edit.sessoes))) };
    if (sem) return { origem: "horario", ficheiroMaisNovo: false, sessoes: ordenarSessoes(JSON.parse(JSON.stringify(sem.sessoes))) };
    var prev = [];
    for (var i = 0; i < 7; i++) prev = prev.concat(sessoesPrevistas(ctx.aulas || {}, ctx.faixas, somarDias(segunda, i)));
    return { origem: prev.length ? "previsto" : "vazio", ficheiroMaisNovo: false, sessoes: ordenarSessoes(prev) };
  }

  function validarEvento(e) {
    if (!e || typeof e.titulo !== "string" || !e.titulo.trim()) return "Escreve um título.";
    if (!dataValida(e.data)) return "Data inválida.";
    if (!horaValida(e.hora)) return "Hora inválida (usa HH:MM).";
    if (e.nota !== null && e.nota !== undefined && e.nota !== "" && (isNaN(Number(e.nota)) || Number(e.nota) < 0 || Number(e.nota) > 20)) return "Nota inválida (0 a 20).";
    return null;
  }
  function novoEvento(o) {
    var e = {
      id: "e" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      tipo: TIPOS.indexOf(o.tipo) >= 0 ? o.tipo : "outro",
      titulo: String(o.titulo || "").trim(), uc: o.uc || "", data: o.data, hora: o.hora || "", notas: o.notas || "", feito: false, nota: null,
    };
    return validarEvento(e) ? null : e;
  }

  function porDataHora(a, b) { var ka = a.data + (a.hora || ""), kb = b.data + (b.hora || ""); return ka < kb ? -1 : ka > kb ? 1 : 0; }
  function eventosDoDia(eventos, d) { return (eventos || []).filter(function (e) { return e.data === d; }).sort(porDataHora); }
  function proximosPrazos(eventos, hoje, dias) {
    var fim = somarDias(hoje, dias);
    return (eventos || []).filter(function (e) { return !e.feito && e.data >= hoje && e.data <= fim; }).sort(porDataHora);
  }

  function marcosDoDia(modulos, d) {
    var r = [];
    modulos.forEach(function (m) {
      if (m.inicio === d) r.push({ uc: m.codigo, tipo: "inicio" });
      if (m.fim === d) r.push({ uc: m.codigo, tipo: "fim" });
    });
    return r;
  }

  function corDoModulo(codigo, modulos) {
    for (var i = 0; i < modulos.length; i++) if (modulos[i].codigo === codigo) return i % 10;
    return 0;
  }

  window.Agenda = {
    TIPOS: TIPOS, somarDias: somarDias, segundaDaSemana: segundaDaSemana, diaSemana: diaSemana, dataValida: dataValida,
    horaValida: horaValida, horaParaMin: horaParaMin, gradeMes: gradeMes, feriadosDoAno: feriadosDoAno,
    feriadoDoDia: feriadoDoDia, feriasDoDia: feriasDoDia, sessoesPrevistas: sessoesPrevistas, sessoesDaSemana: sessoesDaSemana,
    validarEvento: validarEvento, novoEvento: novoEvento, eventosDoDia: eventosDoDia, proximosPrazos: proximosPrazos,
    marcosDoDia: marcosDoDia, corDoModulo: corDoModulo,
  };
})();
