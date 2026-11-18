/* 时间线(44s):塔架 → 枢轮斗 → 天关天锁 → 平水壶 → 机轮浑仪 →
   演动(步进) → 擒纵特写 → 快步 → 总结 */
(function (MECH) {
  var KS = MECH.KS, D = MECH.DIM;

  MECH.PHASES = [
    { id: "tower", name: "TOWER · 五层塔架", dur: 4, dot: "yellow", mode: "ASSEMBLING",
      cam: { theta: 0.55, phi: 1.18, r: 9.5, target: [0, 2.8, 0] }, drift: 0.03 },
    { id: "wheel", name: "SHU LUN · 枢轮 36 斗", dur: 4, dot: "teal", mode: "ASSEMBLING",
      cam: { theta: 0.30, phi: 1.22, r: 4.6, target: [0, 1.2, 0.1] }, drift: 0.01 },
    { id: "escapement", name: "TIAN GUAN · 天关天锁", dur: 4, dot: "orange", mode: "ASSEMBLING",
      cam: { theta: 0.15, phi: 1.24, r: 3.4, target: [0, 1.3, 0.2] }, drift: 0.008 },
    { id: "dial", name: "DIAL · 机轮浑仪平水壶", dur: 4, dot: "pink", mode: "ASSEMBLING",
      cam: { theta: -0.35, phi: 1.18, r: 7.0, target: [0, 3.0, 0] }, drift: 0.015 },
    { id: "slow", name: "STEP · 演动(每步 2.15s)", dur: 8, dot: "green", mode: "STEPPING",
      cam: { theta: 0.75, phi: 1.20, r: 6.0, target: [0, 1.8, 0.1] }, drift: 0.01 },
    { id: "closeup", name: "CLOSE · 擒纵特写(关-锁-斗)", dur: 7, dot: "yellow", mode: "CLOSE-UP",
      cam: { theta: 0.20, phi: 1.26, r: 3.0, target: [-0.2, 1.3, 0.2] }, drift: 0.006 },
    { id: "fast", name: "FAST · 快步 1.7×", dur: 7, dot: "pink", mode: "FAST",
      cam: { theta: -0.5, phi: 1.18, r: 6.4, target: [0, 1.8, 0.1] }, drift: 0.02 },
    { id: "summary", name: "SUMMARY · 擒纵先声", dur: 5, dot: "green", mode: "REVIEW",
      cam: { theta: 0.0, phi: 1.10, r: 9.0, target: [0, 2.8, 0] }, drift: 0.05 }
  ];
  MECH.PHASE_IDS = ["tower", "wheel", "escapement", "dial", "slow", "closeup", "fast", "summary"];

  MECH.newState = KS.newState;

  MECH.tick = function (st, ph, pt, dt) {
    if (ph.id !== st.lastPhase) {
      st.lastPhase = ph.id;
      st.speed = ph.id === "fast" ? D.k.fast : 1.0;
    }
    var d0 = st.drops;
    KS.step(st, dt);
    /* 注水粒子(锁止段) */
    if (st.mode === "locked" && Math.random() < dt * 6) {
      MECH.Scene3D.spawnPuff(-D.wheelR * 0.15, D.wheelR + 0.42, 0.1, {
        max: 0.45, base: 0.05, vx: 0, vy: -0.6, vz: 0, opacity: 0.7, tint: 0x7FC4E0, grow: 0.6
      });
    }
    if (st.drops > d0) {
      MECH.Scene3D.spawnPuff(-D.wheelR * 0.75, D.wheelR + 0.32, 0.1, {
        max: 0.6, base: 0.10, vx: -0.2, vy: -0.55, vz: 0, opacity: 0.7, tint: 0x7FC4E0, grow: 0.7
      });
    }
  };

  MECH.status = function (st, ph, pt) {
    var pill = ph.name;
    if (ph.id === "slow" || ph.id === "closeup" || ph.id === "fast") {
      pill = ph.name + " · " + (st.mode === "stepping" ? "步进中" : "锁止注水");
    }
    return {
      mode: ph.mode,
      hot: st.mode === "stepping",
      pill: pill,
      a: "步 " + st.steps + "/36",
      b: "斗角 " + ((st.phi / D.stepAngle) % D.buckets).toFixed(1),
      c: "机轮 " + st.dialSteps
    };
  };

  MECH.pinnedFor = function (ph) {
    function E(id) { var e = MECH.Parts.entry(id); return e ? (e.anchor || e.group) : null; }
    if (ph.id === "wheel") return [{ id: "p-w", obj: E("wheel"), text: "枢轮 36 斗 · 步进角 10°" }];
    if (ph.id === "escapement") return [
      { id: "p-g", obj: E("escapement"), text: "天关抵轮 · 天锁锁止" },
      { id: "p-v", obj: E("vat"), text: "平水壶注斗 · 满则失衡", tone: "white" }
    ];
    if (ph.id === "dial") return [
      { id: "p-d", obj: E("dial"), text: "昼夜机轮 · 天柱直传" },
      { id: "p-a", obj: E("armillary"), text: "顶部浑仪", tone: "white" }
    ];
    if (ph.id === "slow" || ph.id === "closeup" || ph.id === "fast" || ph.id === "summary") return [
      { id: "p-g", obj: E("escapement"), text: "满斗 → 关开 → 步进 → 锁止", tone: "white" },
      { id: "p-w", obj: E("wheel"), text: "斗注水失衡而下" }
    ];
    return [];
  };
})(window.MECH = window.MECH || {});
