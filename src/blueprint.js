/* 图纸面板(B 键):水运仪象台侧视总图 + 擒纵详图 + 尺寸表 */
(function (MECH) {
  var red = "#8C2F1E";

  MECH.BP = {
    no: "Fig. 16 · 复原剖视图",
    title: "水运仪象台 · 天关天锁擒纵 · 枢轮 36 斗",
    src: "苏颂《新仪象法要》(1092) · 擒纵机构之先声 · 五层塔高五丈六尺",
    draw: function (ctx, w, h) {
      var D = MECH.DIM;
      ctx.clearRect(0, 0, w, h);
      var chainH = 44, chainY = h - chainH - 12, topY = 34;
      var ink = "#2A2620";
      ctx.fillStyle = red;
      ctx.font = "700 11px Menlo, monospace";
      ctx.textAlign = "left";
      ctx.fillText("步进角 = 2π/36(10°/斗)· 斗满失衡 → 天关开 → 枢轮步进一斗 → 天锁再止 · 36 步恰一周", w * 0.045, topY - 10);

      /* ============ 左:剖视图 ============ */
      var S = Math.min(w * 0.42 / 3.0, (chainY - topY - 26) / 6.6);
      var ox = w * 0.05, oy = chainY - 16;
      var X = function (m) { return ox + (m + 1.5) * S; }, Y = function (m) { return oy - m * S; };
      ctx.strokeStyle = ink;
      ctx.fillStyle = ink;
      ctx.lineWidth = 1.4;
      ctx.font = "700 11px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("剖视 SECTION", ox, Y(6.3));
      /* 塔架 */
      ctx.beginPath();
      ctx.moveTo(X(-D.towerW / 2), Y(0)); ctx.lineTo(X(-D.towerW / 2), Y(D.towerH));
      ctx.moveTo(X(D.towerW / 2), Y(0)); ctx.lineTo(X(D.towerW / 2), Y(D.towerH));
      ctx.stroke();
      /* 层板 */
      [1.10, 2.10, 3.10, 4.10, 4.95].forEach(function (y) {
        ctx.beginPath();
        ctx.moveTo(X(-D.towerW / 2), Y(y));
        ctx.lineTo(X(0.25), Y(y));
        ctx.stroke();
      });
      /* 顶部浑仪 */
      ctx.beginPath(); ctx.arc(X(0), Y(D.towerH + 0.35), 0.30 * S, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(X(0), Y(D.towerH + 0.35), 0.18 * S, 0, Math.PI * 2); ctx.stroke();
      /* 昼夜机轮(五小轮) */
      for (var k = 0; k < 5; k++) {
        ctx.beginPath(); ctx.arc(X(-D.towerW / 2 + 0.28), Y(2.75 + k * 0.24), 0.10 * S, 0, Math.PI * 2); ctx.stroke();
      }
      /* 枢轮(圆 + 斗齿)+ 天关天锁 */
      var wr = D.wheelR;
      ctx.beginPath(); ctx.arc(X(0), Y(wr + 0.30), wr * S, 0, Math.PI * 2); ctx.stroke();
      for (var b = 0; b < 12; b++) {
        var a = b / 12 * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(X(0) + Math.cos(a) * wr * S, Y(wr + 0.30) - Math.sin(a) * wr * S);
        ctx.lineTo(X(0) + Math.cos(a) * (wr + 0.07) * S, Y(wr + 0.30) - Math.sin(a) * (wr + 0.07) * S);
        ctx.stroke();
      }
      /* 天关(左)天锁(右) */
      ctx.beginPath();
      ctx.moveTo(X(-wr - 0.36), Y(wr + 0.30 - 0.10));
      ctx.lineTo(X(-wr + 0.02), Y(wr + 0.30 - 0.10));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(X(wr + 0.05), Y(wr + 0.30 - 0.14));
      ctx.lineTo(X(wr - 0.12), Y(wr + 0.30 - 0.14));
      ctx.stroke();
      ctx.font = "600 8px sans-serif";
      ctx.fillStyle = "rgba(42,38,32,0.6)";
      ctx.fillText("天关", X(-wr - 0.30), Y(wr + 0.30 - 0.10) - 5);
      ctx.fillText("天锁", X(wr - 0.10), Y(wr + 0.30 - 0.14) - 5);
      /* 平水壶 */
      ctx.beginPath(); ctx.arc(X(-D.towerW / 2 + 0.30), Y(3.45), 0.15 * S, 0, Math.PI * 2); ctx.stroke();
      ctx.fillText("平水壶", X(-D.towerW / 2 + 0.30) - 16, Y(3.45) - 0.20 * S);
      /* 尺寸 */
      arrow(ctx, X(-D.towerW / 2) - 10, Y(0), X(-D.towerW / 2) - 10, Y(D.towerH), "高五丈六尺", false);

      /* ============ 右:擒纵时序详图 ============ */
      var ox2 = w * 0.55;
      ctx.font = "700 11px sans-serif";
      ctx.fillStyle = ink;
      ctx.fillText("擒纵循环 ESCAPEMENT", ox2, topY + 18);
      var gx = ox2, gy = topY + 32, gw = w - ox2 - 24, gh = chainY - gy - 44;
      ctx.strokeStyle = "rgba(42,38,32,0.5)";
      ctx.strokeRect(gx, gy, gw, gh);
      /* 两段:注水(长)→ 步进(短) */
      var fillW = gw * 0.62, stepW = gw * 0.30;
      ctx.fillStyle = "rgba(233,201,60,0.4)";
      ctx.fillRect(gx + 10, gy + 14, fillW, 22);
      ctx.fillStyle = "rgba(127,216,216,0.7)";
      ctx.fillRect(gx + 10 + fillW + 8, gy + 14, stepW, 22);
      ctx.font = "600 8.5px sans-serif";
      ctx.fillStyle = "rgba(42,38,32,0.6)";
      ctx.fillText("锁止注水 1.6s(斗渐满,天关抵住)", gx + 14, gy + 27);
      ctx.fillText("步进 0.55s", gx + 10 + fillW + 12, gy + 27);
      /* 第二行:斗满失衡说明 */
      ctx.font = "600 8.5px sans-serif";
      ctx.fillText("斗满 → 失衡下转 → 天关开 → 过一斗 → 天锁再止", gx + 12, gy + 52);
      ctx.fillText("36 斗 ⇒ 每周 36 步 = 恰一转", gx + 12, gy + 66);
      ctx.fillStyle = red;
      ctx.font = "700 10px Menlo, monospace";
      ctx.fillText("ω均 = (2π/36)/(1.6+0.55)s", gx + gw * 0.52, gy + gh - 10);

      /* ============ 底部:参数链 ============ */
      var boxes = [
        ["平水壶注斗", "水头恒定"], ["斗满失衡", "枢轮下转"], ["天关开", "放行一斗"],
        ["天锁再止", "间歇锁止"], ["昼夜机轮", "天柱直传"], ["浑仪旋", "三环窥管"]
      ];
      var bwid = (w * 0.91) / boxes.length;
      for (var b = 0; b < boxes.length; b++) {
        var bx2 = w * 0.045 + b * bwid;
        ctx.strokeStyle = ink;
        ctx.fillStyle = ink;
        ctx.strokeRect(bx2, chainY, bwid - 10, chainH);
        ctx.font = "700 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(boxes[b][0], bx2 + (bwid - 10) / 2, chainY + 17);
        ctx.font = "600 8.5px Menlo, monospace";
        ctx.fillStyle = "rgba(42,38,32,0.55)";
        ctx.fillText(boxes[b][1], bx2 + (bwid - 10) / 2, chainY + 32);
        if (b < boxes.length - 1) {
          ctx.beginPath();
          ctx.moveTo(bx2 + bwid - 10, chainY + 20);
          ctx.lineTo(bx2 + bwid - 2, chainY + 20);
          ctx.stroke();
        }
      }
    },
    table:
      '<h4>塔与轮</h4><table>' +
      '<tr><th>塔架</th><td>五层 · 高五丈六尺(演示 5.6 m)</td><td>W 2.3 m</td></tr>' +
      '<tr><th>枢轮</th><td>R 0.85 · 36 受水斗</td><td>步进角 10°</td></tr>' +
      '<tr><th>擒纵</th><td>天关(左杠杆)+ 天锁(右锁杆)</td><td>间歇锁止</td></tr>' +
      '<tr><th>平水壶</th><td>注水入斗 · 水头恒定</td><td>—</td></tr>' +
      '</table><h4>运动学</h4><table>' +
      '<tr><th>锁止段</th><td>斗注水 1.6s(天关抵住)</td><td>—</td></tr>' +
      '<tr><th>步进段</th><td>枢轮转 2π/36 · 0.55s</td><td>10°</td></tr>' +
      '<tr><th>整周</th><td>36 步 = 2π(自检断言)</td><td>—</td></tr>' +
      '<tr><th>昼夜机轮</th><td>五层小轮随动(天柱直传)</td><td>—</td></tr>' +
      '</table><h4>运行期自检</h4>' +
      '<p>载入模拟 40 步:每步转角与 2π/36 偏差 < 1e-9、36 步恰整周,否则拒绝启动。</p>' +
      '<h4>文献</h4>' +
      '<p>苏颂《新仪象法要》卷上记枢轮三十六受水壶、天关天锁左右互扣——“水入壶……壶满则枢轮动,而天关随启”。</p>' +
      '<p>此间歇步进传动即机械擒纵机构之先声,早于欧洲钟表擒纵约六百年。</p>'
  };
})(window.MECH = window.MECH || {});
