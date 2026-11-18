// Leitura e gravação de ficheiros JSON do repositório (data/<nome>.json).
// Com token pessoal grava no GitHub (Contents API); sem token só lê. Há sempre uma cópia local (localStorage).
(function () {
  function b64(str) { return btoa(unescape(encodeURIComponent(str))); }
  function desb64(s) { return decodeURIComponent(escape(atob(String(s).replace(/\s/g, "")))); }

  // Devolve o objeto com `atualizadoEm` mais recente (a, b podem ser null).
  function maisRecente(a, b) {
    if (!a) return b || null;
    if (!b) return a;
    return (a.atualizadoEm || "") >= (b.atualizadoEm || "") ? a : b;
  }

  function criar(opts) {
    var repo = opts.repo, branch = opts.branch || "main";
    var f = opts.fetch || function (u, o) { return fetch(u, o); };
    var st = opts.storage;
    var agora = opts.agora || function () { return new Date().toISOString(); };
    var tokenKey = opts.tokenKey || "acad-token";
    var atraso = opts.atraso === undefined ? 800 : opts.atraso;
    var ouvintes = [], base = {}, timers = {}, esperando = {};

    function emitir(e, nome) { ouvintes.forEach(function (fn) { try { fn(e, nome); } catch (x) { /* ignora */ } }); }
    function lerLS(k) { try { return st.getItem(k); } catch (e) { return null; } }
    function escreverLS(k, v) { try { st.setItem(k, v); } catch (e) { /* sem armazenamento */ } }
    function token() { return lerLS(tokenKey) || ""; }
    function cache(nome) {
      try { var o = JSON.parse(lerLS("acad:" + nome)); return o && o.dados ? o : null; } catch (e) { return null; }
    }
    function guardarCache(nome, dados, pendente) { escreverLS("acad:" + nome, JSON.stringify({ dados: dados, pendente: pendente })); }
    function urlApi(nome) { return "https://api.github.com/repos/" + repo + "/contents/data/" + nome + ".json"; }
    function cabecalhos(extra) {
      var h = { Authorization: "Bearer " + token(), Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
      for (var k in (extra || {})) h[k] = extra[k];
      return h;
    }

    // { dados, sha } | null (404). Lança { status } noutros erros HTTP.
    function lerRemoto(nome) {
      if (token()) {
        return f(urlApi(nome) + "?ref=" + branch, { headers: cabecalhos() }).then(function (r) {
          if (r.status === 404) return null;
          if (!r.ok) throw { status: r.status };
          return r.json().then(function (j) {
            var dados = {};
            try { dados = JSON.parse(desb64(j.content)); } catch (e) { dados = {}; }
            return { dados: dados, sha: j.sha };
          });
        });
      }
      return f("data/" + nome + ".json?v=" + Date.now()).then(function (r) {
        if (!r.ok) return null;
        return r.json().then(function (d) { return { dados: d, sha: null }; }, function () { return null; });
      });
    }

    function carregar(nome, vazio) {
      var local = cache(nome);
      return lerRemoto(nome).catch(function () { return null; }).then(function (remoto) {
        if (remoto) base[nome] = remoto.dados.atualizadoEm || "";
        var res;
        if (local && local.pendente) res = { dados: local.dados, origem: "local", pendente: true };
        else if (remoto && local && (local.dados.atualizadoEm || "") > (remoto.dados.atualizadoEm || "")) res = { dados: local.dados, origem: "local", pendente: false };
        else if (remoto) res = { dados: remoto.dados, origem: "remoto", pendente: false };
        else if (local) res = { dados: local.dados, origem: "local", pendente: !!local.pendente };
        else res = { dados: vazio, origem: "vazio", pendente: false };
        if (res.pendente && token()) agendar(nome);
        return res;
      });
    }

    function enviar(nome) {
      var loc = cache(nome);
      if (!loc) return Promise.resolve();
      var dados = loc.dados;
      emitir("a-guardar", nome);
      return lerRemoto(nome).then(function (rem) {
        if (rem && base[nome] !== undefined && (rem.dados.atualizadoEm || "") > base[nome]) { emitir("conflito", nome); return; }
        var corpo = { message: "dados: " + nome + " (site)", content: b64(JSON.stringify(dados, null, 2) + "\n"), branch: branch };
        if (rem && rem.sha) corpo.sha = rem.sha;
        return f(urlApi(nome), { method: "PUT", headers: cabecalhos({ "Content-Type": "application/json" }), body: JSON.stringify(corpo) }).then(function (r) {
          if (r.ok) {
            base[nome] = dados.atualizadoEm || "";
            guardarCache(nome, dados, false);
            emitir("guardado", nome);
          } else if (r.status === 409 || r.status === 422) emitir("conflito", nome);
          else emitir("erro", nome);
        });
      }).catch(function () { emitir("erro", nome); });
    }

    function agendar(nome) {
      emitir("a-guardar", nome);
      return new Promise(function (resolve) {
        (esperando[nome] = esperando[nome] || []).push(resolve);
        clearTimeout(timers[nome]);
        timers[nome] = setTimeout(function () {
          var rs = esperando[nome]; esperando[nome] = [];
          enviar(nome).then(function () { rs.forEach(function (r) { r(); }); });
        }, atraso);
      });
    }

    function guardar(nome, dados) {
      dados.atualizadoEm = agora();
      guardarCache(nome, dados, true);
      if (!token()) { emitir("sem-token", nome); return Promise.resolve(); }
      return agendar(nome);
    }

    return {
      temToken: function () { return !!token(); },
      definirToken: function (t) { escreverLS(tokenKey, String(t || "").trim()); },
      removerToken: function () { try { st.removeItem(tokenKey); } catch (e) { /* ignora */ } },
      carregar: carregar,
      guardar: guardar,
      aoMudarEstado: function (fn) { ouvintes.push(fn); },
      temPendentes: function (nomes) { return nomes.some(function (n) { var c = cache(n); return c && c.pendente; }); },
    };
  }

  window.Armazem = { criar: criar, b64: b64, desb64: desb64, maisRecente: maisRecente };
})();
