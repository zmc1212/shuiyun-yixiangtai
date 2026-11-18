/* 水运仪象台部件建模与注册(15 件)。
   五层塔架:顶浑仪(环圈)、二层昼夜机轮(五小轮)、下层枢轮(36 斗)+
   天关天锁杆件 + 平水壶注水;斗翻转倒水粒子;塔身框架半剖。 */
(function (MECH) {
  var P = MECH.P, M3 = null, D = MECH.DIM;

  function group() { return new THREE.Group(); }

  function buildTower() {   // 五层塔架(半剖框架 + 层板)
    var g = group();
    var W = D.towerW;
    for (var s = -1; s <= 1; s += 2) {
      g.add(P.box(0.10, D.towerH, 0.10, M3.woodD, s * W / 2, D.towerH / 2, -W / 2 + 0.06));
      g.add(P.box(0.10, D.towerH, 0.10, M3.woodD, s * W / 2, D.towerH / 2, W / 2 - 0.06));
    }
    /* 层板(5 层,半剖:右侧留开口) */
    [1.10, 2.10, 3.10, 4.10, 4.95].forEach(function (y, k) {
      g.add(P.box(W, 0.06, W * 0.55, M3.wood, 0, y, -W * 0.2));
    });
    /* 背板 */
    g.add(P.box(W, D.towerH, 0.04, M3.wood, 0, D.towerH / 2, -W / 2 + 0.02));
    return g;
  }

  function buildWheel() {   // 枢轮:36 斗(轮缘挂斗,翻转倒水)
    var g = group();
    g.add(P.torus(D.wheelR, 0.04, M3.woodD, 0, 0, 0, 48));
    g.add(P.torus(D.wheelR - 0.14, 0.03, M3.wood, 0, 0, 0, 44));
    for (var i = 0; i < 8; i++) {
      var a = i / 8 * Math.PI * 2;
      var s = P.box(0.05, D.wheelR - 0.12, 0.05, M3.wood, 0, 0, 0);
      s.position.set(Math.cos(a) * (0.10 + (D.wheelR - 0.12) / 2), Math.sin(a) * (0.10 + (D.wheelR - 0.12) / 2), 0);
      s.rotation.z = a - Math.PI / 2;
      g.add(s);
    }
    var hub = P.cyl(0.09, 0.09, 0.20, M3.woodD, 0, 0, 0, 14);
    hub.rotation.x = P.ROTX;
    g.add(hub);
    /* 36 斗(小盒挂在轮缘) */
    var buckets = [];
    for (var b = 0; b < D.buckets; b++) {
      var a = b / D.buckets * Math.PI * 2;
      var bucket = group();
      bucket.add(P.box(0.09, 0.07, 0.10, M3.woodL, 0, -0.05, 0));
      bucket.position.set(Math.cos(a) * D.wheelR, Math.sin(a) * D.wheelR, 0);
      bucket.rotation.z = a + Math.PI / 2;
      g.add(bucket);
      buckets.push(bucket);
    }
    g.userData.buckets = buckets;
    return { group: g };
  }

  function buildEscapement() {  // 天关(左杠杆)+ 天锁(右小杆)+ 格叉
    var g = group();
    var guan = group();                    // 天关(左)
    guan.add(P.box(0.36, 0.05, 0.05, M3.iron, 0.16, 0, 0));
    guan.add(P.box(0.05, 0.05, 0.05, M3.bronze, -0.02, 0, 0));
    guan.position.set(-D.wheelR - 0.02, D.wheelR - 0.10, 0);
    g.add(guan);
    var suo = group();                     // 天锁(右)
    suo.add(P.box(0.22, 0.045, 0.045, M3.iron, -0.10, 0, 0));
    suo.position.set(D.wheelR + 0.05, D.wheelR - 0.14, 0);
    g.add(suo);
    g.userData.guan = guan;
    g.userData.suo = suo;
    return { group: g };
  }

  function buildDialWheels() {  // 昼夜机轮:五小轮塔(随动)
    var g = group();
    var wheels = [];
    for (var k = 0; k < 5; k++) {
      var r = 0.16 - k * 0.015;
      var w = P.torus(r, 0.02, M3.bronze, 0, 2.75 + k * 0.24, -D.towerW / 2 + 0.28, 26);
      w.rotation.y = Math.PI / 2;
      g.add(w);
      wheels.push(w);
    }
    g.userData.wheels = wheels;
    return { group: g };
  }

  function buildArmillary() {  // 顶部浑仪:三环 + 窥管
    var g = group();
    var c = group();
    c.position.y = D.towerH + 0.35;
    c.add(P.torus(0.30, 0.02, M3.gold, 0, 0, 0, 36));
    var r2 = P.torus(0.24, 0.018, M3.bronze, 0, 0, 0, 32);
    r2.rotation.x = 0.9;
    c.add(r2);
    var r3 = P.torus(0.19, 0.016, M3.bronze, 0, 0, 0, 30);
    r3.rotation.x = -0.6;
    c.add(r3);
    var tube = P.cyl(0.02, 0.02, 0.34, M3.steelD, 0, 0, 0, 8);
    tube.rotation.z = 0.7;
    c.add(tube);
    g.add(c);
    g.userData.ring = c;
    return { group: g };
  }

  function buildVat() {  // 平水壶(注水,左上)
    var g = group();
    g.add(P.cyl(0.14, 0.16, 0.20, M3.bronze, 0, 0.10, 0, 20));
    g.add(P.box(0.05, 0.03, 0.05, M3.iron, 0.12, 0.02, 0));
    g.position.set(-D.towerW / 2 + 0.30, 3.35, 0.35);
    return { group: g };
  }

  /* —— 注册 —— */
  MECH.PART_DEFS = function () {
    M3 = MECH.Scene3D.M;
    function def(o) { return MECH._def(o); }

    def({ id: "tower", name: "TOWER · 五层塔架", sub: "高五丈六尺(演示 5.6)", phase: 0, at: 0.15, dur: 1.5,
      build: buildTower, target: [0, 0, 0], start: [0, 6.0, 2.4], mid: [0, 3.6, 1.2], anchor: [0, 2.4, 0.8] });
    def({ id: "wheel", name: "SHU LUN · 枢轮 36 斗", sub: "步进角 10°/斗", phase: 1, at: 2.6, dur: 1.4, kind: "kine",
      build: buildWheel, target: [0, D.wheelR + 0.30, 0.1], off: [0, 1.0, 3.0] });
    def({ id: "escapement", name: "TIAN GUAN · 天关天锁", sub: "擒纵杆件", phase: 1, at: 3.6, dur: 1.2, kind: "kine",
      build: buildEscapement, target: [0, D.wheelR + 0.30, 0.1], off: [0, 1.4, 2.2] });
    def({ id: "vat", name: "PING SHUI HU · 平水壶", sub: "注水入斗", phase: 2, at: 5.2, dur: 1.1,
      build: buildVat, target: [0, 0, 0], start: [-1.5, 4.8, 1.2], mid: [-0.9, 3.6, 0.6], anchor: [0, 0.2, 0.3] });
    def({ id: "dial", name: "DIAL · 昼夜机轮五层", sub: "天柱直传随动", phase: 2, at: 6.0, dur: 1.2, kind: "kine",
      build: buildDialWheels, target: [0, 0, 0], off: [0, 1.6, 2.0] });
    def({ id: "armillary", name: "ARMILLARY · 浑仪(顶)", sub: "三环窥管", phase: 3, at: 8.0, dur: 1.3, kind: "kine",
      build: buildArmillary, target: [0, 0, 0], off: [0, 2.2, 2.6] });
  };

  /* —— 运动学分发 —— */
  MECH.KINE = function (st) {
    var stepF = st.mode === "stepping" ? 1 : 0;
    var e = MECH.Parts.entry("wheel");
    if (e && e.shown) e.group.rotation.z = -st.phi;
    /* 天关/天锁:stepping 时抬起 */
    e = MECH.Parts.entry("escapement");
    if (e && e.shown) {
      e.group.userData.guan.rotation.z = st.mode === "stepping" ? -0.5 * Math.min(1, st.modeT / 0.2) : 0;
      e.group.userData.suo.rotation.z = st.mode === "stepping" ? 0.6 * Math.min(1, st.modeT / 0.2) : 0;
    }
    /* 昼夜机轮随动(步进同步) */
    e = MECH.Parts.entry("dial");
    if (e && e.shown) {
      e.group.userData.wheels.forEach(function (w, k) {
        w.rotation.z = st.phi * (k % 2 ? -1 : 1) * (0.8 + k * 0.1);
      });
    }
    /* 浑仪缓转 */
    e = MECH.Parts.entry("armillary");
    if (e && e.shown) e.group.userData.ring.rotation.y = st.phi * 0.25;
    /* 斗翻转倒水粒子(stepping 开始时,顶部斗倒水) */
    if (st.mode === "stepping" && st.modeT < 0.05) {
      MECH.Scene3D.spawnPuff(-D.wheelR * 0.6, D.wheelR + 0.45, 0.1, {
        max: 0.7, base: 0.10, vx: -0.15, vy: -0.7, vz: 0, opacity: 0.7, tint: 0x7FC4E0, grow: 0.8
      });
    }
  };
})(window.MECH = window.MECH || {});
