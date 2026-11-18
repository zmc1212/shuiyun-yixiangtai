/* 仪表盘:①步进计数+状态 ②枢轮角度盘 ③擒纵时序 ④机轮随动 */
(function (MECH) {
  var el = {}, D = MECH.DIM;
  var soft = "rgba(233,238,242,0.5)";

  MECH.DASH = { panels: [
    { title: "STEP · 步进计数", meta: "36 斗/周", dot: "teal",
      html: '<div class="big" id="d-step">0</div><div class="k">步 / 36</div>' +
            '<div class="bar"><i id="d-bar"></i></div>' +
            '<div class="rowline"><span>状态</span><b id="d-mode">—</b></div>' +
            '<div class="chip" id="d-chip">—</div>',
      init: initStep, draw: drawStep },
    { title: "WHEEL · 枢轮角", meta: "10°/斗", dot: "blue", canvasH: 96, draw: drawWheel },
    { title: "ESCAPE · 擒纵时序", meta: "锁止/步进", dot: "yellow", canvasH: 96, draw: drawEscape },
    { title: "DIAL · 机轮随动", meta: "天柱直传", dot: "green", canvasH: 96, draw: drawDial }
  ] };

  function initStep(sec) {
    el.step = sec.querySelector("#d-step");
    el.bar = sec.querySelector("#d-bar");
    el.mode = sec.querySelector("#d-mode");
    el.chip = sec.querySelector("#d-chip");
  }

  function drawStep(st, ph, pt, ctx, w, h) {
    if (el.step) el.step.textContent = String(st.steps % D.buckets);
    if (el.bar) el.bar.style.width = (st.steps % D.buckets) / D.buckets * 100 + "%";
    if (el.mode) el.mode.textContent = st.mode === "stepping" ? "步进" : "锁止注水";
    if (el.chip) {
      el.chip.textContent = st.mode === "stepping" ? "天关开 · 斗水下" : "斗注水 · 失衡待发";
      el.chip.className = "chip" + (st.mode === "stepping" ? " on" : " warn");
    }
  }

  /* ② 枢轮角度盘:36 斗格 + 当前角 */
  function drawWheel(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    var cx = w * 0.5, cy = h * 0.52, R = Math.min(cx, cy) - 8;
    ctx.strokeStyle = "rgba(233,238,242,0.28)";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    for (var k = 0; k < D.buckets; k++) {
      var a = k * D.stepAngle - Math.PI / 2;
      ctx.strokeStyle = "rgba(233,238,242,0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82);
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
      ctx.stroke();
    }
    /* 已走过的斗高亮 */
    var walked = st.steps % D.buckets;
    ctx.strokeStyle = "#7FD8D8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 3, -Math.PI / 2, -Math.PI / 2 + walked * D.stepAngle);
    ctx.stroke();
    /* 指针 */
    var a2 = st.phi - Math.PI / 2;
    ctx.strokeStyle = "#E9C93C";
    ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a2) * R * 0.7, cy + Math.sin(a2) * R * 0.7); ctx.stroke();
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("φ = " + (st.phi * 180 / Math.PI % 360).toFixed(1) + "°", 4, 10);
  }

  /* ③ 擒纵时序:锁止/步进状态条(滚窗) */
  var modeHist = [];
  function drawEscape(st, ph, pt, ctx, w, h) {
    if (modeHist.length === 0 || modeHist[modeHist.length - 1].m !== st.mode) {
      modeHist.push({ t: st.time, m: st.mode });
      if (modeHist.length > 40) modeHist.shift();
    }
    ctx.clearRect(0, 0, w, h);
    var span = 12;
    for (var i = 0; i < modeHist.length; i++) {
      var t0 = modeHist[i].t, m = modeHist[i].m;
      var t1 = i + 1 < modeHist.length ? modeHist[i + 1].t : st.time;
      if (st.time - t1 > span) continue;
      var x0 = w - (st.time - t0) / span * w;
      var x1 = w - (st.time - t1) / span * w;
      ctx.fillStyle = m === "stepping" ? "rgba(127,216,216,0.7)" : "rgba(233,201,60,0.45)";
      var xL = Math.max(0, Math.min(x0, x1)), xR = Math.min(w, Math.max(x0, x1));
      ctx.fillRect(xL, h - 22, xR - xL, 10);
    }
    ctx.fillStyle = "#E9EEF2";
    ctx.font = "800 13px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText(st.mode === "stepping" ? "步进 0.55s" : "注水 " + (D.fillT / st.speed).toFixed(1) + "s", 4, 20);
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.fillText("青=步进 黄=锁止 · 窗 12s", 4, 34);
    ctx.strokeStyle = "rgba(233,238,242,0.16)";
    ctx.beginPath(); ctx.moveTo(0, h - 12); ctx.lineTo(w, h - 12); ctx.stroke();
  }

  /* ④ 机轮随动:五小轮角标 */
  function drawDial(st, ph, pt, ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    for (var k = 0; k < 5; k++) {
      var y = 14 + k * 15;
      var a = st.phi * (k % 2 ? -1 : 1) * (0.8 + k * 0.1);
      ctx.fillStyle = soft;
      ctx.font = "600 8px Menlo, monospace";
      ctx.textAlign = "left";
      ctx.fillText("轮" + (k + 1), 4, y + 4);
      ctx.strokeStyle = "rgba(233,238,242,0.12)";
      ctx.strokeRect(30, y, w - 44, 8);
      ctx.fillStyle = k % 2 ? "#E86A9E" : "#7FD8D8";
      ctx.fillRect(30, y, Math.abs(a / (2 * Math.PI * 2)) % 1 * (w - 44), 8);
    }
    ctx.fillStyle = soft;
    ctx.font = "600 7.5px Menlo, monospace";
    ctx.textAlign = "left";
    ctx.fillText("五轮随枢轮步进(天柱直传)", 4, h - 4);
  }
})(window.MECH = window.MECH || {});
