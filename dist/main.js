// src/main.ts
var FRAME_SIZE = 500;
var OUTER_SIZE = 420;
var INNER_SIZE = 276;
var ROTATION = 15;
var STROKE_EQUIV = 36;
function centerNode(node, parent) {
  node.x = parent.width / 2 - node.width / 2;
  node.y = parent.height / 2 - node.height / 2;
}
function createSolid(color) {
  return [{ type: "SOLID", color, opacity: 1 }];
}
function createLogoFrame() {
  const frame = figma.createFrame();
  frame.name = "Galeonica Logo";
  frame.resize(FRAME_SIZE, FRAME_SIZE);
  frame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.layoutMode = "NONE";
  frame.clipsContent = false;
  return frame;
}
function createRotatedRect(size, parent) {
  const rect = figma.createRectangle();
  rect.resize(size, size);
  rect.rotation = ROTATION;
  rect.cornerRadius = 2;
  rect.fills = createSolid({ r: 0, g: 0, b: 0 });
  rect.strokes = [];
  parent.appendChild(rect);
  centerNode(rect, parent);
  return rect;
}
function subtract(base, cut, parent) {
  parent.appendChild(base);
  parent.appendChild(cut);
  const result = figma.booleanOperation("SUBTRACT", base, cut);
  result.fills = createSolid({ r: 0, g: 0, b: 0 });
  result.strokes = [];
  return result;
}
function buildLogo() {
  const page = figma.currentPage;
  const frame = createLogoFrame();
  page.appendChild(frame);
  frame.x = figma.viewport.center.x - FRAME_SIZE / 2;
  frame.y = figma.viewport.center.y - FRAME_SIZE / 2;
  const outer = createRotatedRect(OUTER_SIZE, frame);
  const inner = createRotatedRect(INNER_SIZE, frame);
  inner.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  let logoShape = subtract(outer, inner, frame);
  const crossbar = figma.createRectangle();
  crossbar.resize(OUTER_SIZE * 0.6, STROKE_EQUIV);
  crossbar.rotation = ROTATION;
  crossbar.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(crossbar);
  centerNode(crossbar, frame);
  logoShape = subtract(logoShape, crossbar, frame);
  const tail = figma.createRectangle();
  tail.resize(STROKE_EQUIV, OUTER_SIZE * 0.35);
  tail.rotation = ROTATION;
  tail.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  frame.appendChild(tail);
  centerNode(tail, frame);
  tail.x += 90;
  tail.y += 60;
  logoShape = subtract(logoShape, tail, frame);
  frame.appendChild(logoShape);
  figma.currentPage.selection = [logoShape];
  figma.viewport.scrollAndZoomIntoView([logoShape]);
}
buildLogo();
figma.closePlugin("Galeonica logo added.");
