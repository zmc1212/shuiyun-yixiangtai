/* 水运仪象台 — 尺寸常量与天关天锁擒纵步进运动学
   文献依据:苏颂《新仪象法要》(1092):平水壶注水入枢轮受水壶(斗),
   斗满则枢轮失衡下转,天关抵住枢轮,左天锁锁止;斗注满翻水后,天关开、
   格叉接斗、枢轮步进一斗——间歇步进传动(擒纵机构之先声)。
   步进角 = 2π/36(枢轮 36 斗);计时轮随动(天柱直传)。
   载入断言:每步转角严格 = 2π/36;36 步恰一周。 */
(function (MECH) {
  var CHI = 0.3;
  var D = {
    CHI: CHI,
    towerW: 2.3, towerH: 5.6,       // 塔身
    wheelR: 0.85, buckets: 36,      // 枢轮半径/斗数
    bucketCap: 0.11,                // 斗容量(视觉)
    fillT: 1.6,                     // 注水时长(锁止段)
    stepT: 0.55,                    // 步进转动时长
    k: { slow: 1.0, fast: 1.7 }     // 步进倍速(fillT/倍速)
  };
  D.stepAngle = Math.PI * 2 / D.buckets;

  function newState() {
    return {
      time: 0, steps: 0,
      phi: 0,                        // 枢轮累计角(步进量)
      mode: "locked",                // locked(注水) / stepping
      modeT: 0, speed: 1.0,
      dialSteps: 0,                  // 昼夜机轮随动步
      drops: 0,
      lastPhase: "", manual: false, _keyL: false, _keyR: false
    };
  }

  function step(st, dt) {
    st.time += dt;
    st.modeT += dt;
    var fill = D.fillT / st.speed, step = D.stepT / st.speed;
    if (st.mode === "locked") {
      /* 天关抵住,斗注水 */
      if (st.modeT >= fill) {
        st.mode = "stepping";
        st.modeT = 0;
        st._from = st.phi;
        st._to = st.phi + D.stepAngle;
        st.drops += 1;
      }
    } else {
      /* 步进:平滑转过一格 */
      var f = Math.min(1, st.modeT / step);
      var e = 1 - Math.pow(1 - f, 3);
      st.phi = st._from + (st._to - st._from) * e;
      st.dialSteps = st.steps + 1;
      if (f >= 1) {
        st.phi = st._to;
        st.steps += 1;
        st.dialSteps = st.steps;
        st.mode = "locked";
        st.modeT = 0;
      }
    }
  }

  MECH.DIM = D;
  MECH.KS = { newState: newState, step: step };

  (function selfCheck() {
    var errs = [];
    /* 模拟 40 步:步进角严格 2π/36、36 步恰一周 */
    var st = newState();
    st.speed = D.k.fast;
    var prev = 0, maxDev = 0;
    for (var i = 0; i < 12000 && st.steps < 40; i++) {
      var before = st.phi;
      step(st, 1 / 120);
      if (st.mode === "locked" && st.steps > prev) {
        var d = st.phi - prev - D.stepAngle * (st.steps - prev);
        maxDev = Math.max(maxDev, Math.abs(d));
        prev = st.steps;
      }
    }
    if (maxDev > 1e-9) errs.push("步进角偏差 " + maxDev.toExponential(2));
    if (st.steps < 40) errs.push("步进过慢");
    /* 36 步整周 */
    if (Math.abs((st.phi / (2 * Math.PI)) % 1) > 1e-6 && st.phi > 0) {
      var rem = (st.phi / D.stepAngle) % 1;
      if (Math.abs(rem) > 1e-3 && Math.abs(rem - 1) > 1e-3) errs.push("非整斗步进");
    }
    if (errs.length) {
      if (window.MECH_SHOW_BOOT_ERROR) window.MECH_SHOW_BOOT_ERROR("水运仪象台自检失败: " + errs.join(";"));
      throw new Error(errs.join(";"));
    }
  })();
})(window.MECH = window.MECH || {});
