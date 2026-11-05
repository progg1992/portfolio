// PTR-28 spike: writes public/models/topology.glb from the static SVG's layout.
import { BoxGeometry, CylinderGeometry, SphereGeometry } from "three";
import { Document, NodeIO } from "@gltf-transform/core";

const nodes = [
  ["edge-fw", 260, 80, "sphere", "#06B6D4"],
  ["core-sw", 130, 200, "box", "#06B6D4"],
  ["hv-cluster", 390, 200, "box", "#A855F7"],
  ["srv-ad", 90, 330, "small", "#3F3F46"],
  ["ubuntu", 210, 330, "small", "#3F3F46"],
  ["docker", 330, 330, "small", "#A855F7"],
  ["vm-04", 450, 330, "small", "#3F3F46"],
  ["db", 260, 420, "cyl", "#A855F7"],
];
const links = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [4, 7],
  [5, 7],
  [1, 2],
];
const pos = ([, x, y], i) => [(x - 260) / 60, (240 - y) / 60, ((i * 37) % 5) / 5 - 0.4];

const doc = new Document();
const buffer = doc.createBuffer();
const scene = doc.createScene("topology");
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).concat(1);
const materials = new Map();
const material = (color) => {
  if (!materials.has(color))
    materials.set(
      color,
      doc
        .createMaterial(color)
        .setBaseColorFactor(hex(color))
        .setMetallicFactor(0.1)
        .setRoughnessFactor(0.6),
    );
  return materials.get(color);
};
const mesh = (name, geo, color) => {
  const g = geo.index ? geo : geo;
  const prim = doc
    .createPrimitive()
    .setAttribute(
      "POSITION",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(g.attributes.position.array))
        .setBuffer(buffer),
    )
    .setAttribute(
      "NORMAL",
      doc
        .createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(g.attributes.normal.array))
        .setBuffer(buffer),
    )
    .setIndices(
      doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(new Uint16Array(g.index.array))
        .setBuffer(buffer),
    )
    .setMaterial(material(color));
  return doc.createMesh(name).addPrimitive(prim);
};
const geos = {
  sphere: new SphereGeometry(0.32, 20, 14),
  box: new BoxGeometry(0.75, 0.55, 0.55),
  small: new BoxGeometry(0.5, 0.45, 0.45),
  cyl: new CylinderGeometry(0.38, 0.38, 0.35, 24),
};
const meshCache = new Map();
nodes.forEach((n, i) => {
  const key = `${n[3]}-${n[4]}`;
  if (!meshCache.has(key)) meshCache.set(key, mesh(key, geos[n[3]], n[4]));
  scene.addChild(doc.createNode(n[0]).setMesh(meshCache.get(key)).setTranslation(pos(n, i)));
});
const link = mesh("link", new CylinderGeometry(0.025, 0.025, 1, 6), "#52525B");
for (const [a, b] of links) {
  const pa = pos(nodes[a], a),
    pb = pos(nodes[b], b);
  const d = pb.map((v, k) => v - pa[k]);
  const len = Math.hypot(...d);
  const mid = pa.map((v, k) => v + d[k] / 2);
  // rotate +Y onto d
  const y = [0, 1, 0],
    u = d.map((v) => v / len);
  const axis = [y[1] * u[2] - y[2] * u[1], y[2] * u[0] - y[0] * u[2], y[0] * u[1] - y[1] * u[0]];
  const an = Math.hypot(...axis) || 1;
  const angle = Math.acos(Math.max(-1, Math.min(1, u[1])));
  const s = Math.sin(angle / 2);
  scene.addChild(
    doc
      .createNode(`link-${a}-${b}`)
      .setMesh(link)
      .setTranslation(mid)
      .setScale([1, len, 1])
      .setRotation([
        (axis[0] / an) * s,
        (axis[1] / an) * s,
        (axis[2] / an) * s,
        Math.cos(angle / 2),
      ]),
  );
}
await new NodeIO().write(process.argv[2] ?? "public/models/topology.glb", doc);
