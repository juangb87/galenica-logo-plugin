const FRAME_SIZE = 500;
const OUTER_SIZE = 420;
const INNER_SIZE = 276; // outer minus 2*72
const ROTATION = 15;
const STROKE_EQUIV = 36;

const SAIL_FRAME_WIDTH = 420;
const SAIL_FRAME_HEIGHT = 520;

function centerNode(node: SceneNode & { width: number; height: number }, parent: FrameNode) {
  node.x = parent.width / 2 - node.width / 2;
  node.y = parent.height / 2 - node.height / 2;
}

function createLogoFrame(name = 'Galeonica Logo', width = FRAME_SIZE, height = FRAME_SIZE): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.resize(width, height);
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.layoutMode = 'NONE';
  frame.clipsContent = false;
  return frame;
}

function createRotatedRect(size: number, parent: FrameNode): RectangleNode {
  const rect = figma.createRectangle();
  rect.resize(size, size);
  rect.rotation = ROTATION;
  rect.cornerRadius = 2;
  rect.strokes = [];
  rect.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  parent.appendChild(rect);
  centerNode(rect, parent);
  return rect;
}

function createSail(width: number, height: number, curve: number): VectorNode {
  const vector = figma.createVector();
  const c = Math.min(curve, width / 2);
  const path = `M0 0 C ${c} ${height * 0.15} ${c} ${height * 0.85} 0 ${height} L ${width} ${height} C ${width - c} ${height * 0.85} ${width - c} ${height * 0.15} ${width} 0 Z`;
  vector.vectorPaths = [{ windingRule: 'NONZERO', data: path }];
  vector.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  vector.strokes = [];
  vector.strokeWeight = 0;
  return vector;
}

function buildLogo(): FrameNode {
  const page = figma.currentPage;
  const frame = createLogoFrame();
  page.appendChild(frame);
  frame.x = figma.viewport.center.x - FRAME_SIZE - 40;
  frame.y = figma.viewport.center.y - FRAME_SIZE / 2;

  const outer = createRotatedRect(OUTER_SIZE, frame);

  const inner = createRotatedRect(INNER_SIZE, frame);
  inner.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  const crossbar = figma.createRectangle();
  crossbar.resize(OUTER_SIZE * 0.6, STROKE_EQUIV);
  crossbar.rotation = ROTATION;
  crossbar.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  crossbar.strokes = [];
  frame.appendChild(crossbar);
  centerNode(crossbar, frame);

  const tail = figma.createRectangle();
  tail.resize(STROKE_EQUIV, OUTER_SIZE * 0.35);
  tail.rotation = ROTATION;
  tail.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tail.strokes = [];
  frame.appendChild(tail);
  centerNode(tail, frame);
  tail.x += 90;
  tail.y += 60;

  const subtractor = figma.union([inner, crossbar, tail], frame);

  const logoShape = figma.booleanOperation('SUBTRACT', outer, subtractor);
  logoShape.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  logoShape.strokes = [];
  frame.appendChild(logoShape);
  figma.currentPage.selection = [logoShape];
  figma.viewport.scrollAndZoomIntoView([logoShape]);
  return frame;
}

function buildSails(): FrameNode {
  const page = figma.currentPage;
  const frame = createLogoFrame('Galeonica Sails', SAIL_FRAME_WIDTH, SAIL_FRAME_HEIGHT);
  page.appendChild(frame);
  frame.x = figma.viewport.center.x + 40;
  frame.y = figma.viewport.center.y - SAIL_FRAME_HEIGHT / 2;

  const mast = figma.createRectangle();
  mast.resize(10, 360);
  mast.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  mast.strokes = [];
  frame.appendChild(mast);
  centerNode(mast, frame);
  mast.y = 90;

  const yard = figma.createRectangle();
  yard.resize(260, 6);
  yard.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  yard.strokes = [];

  const yardPositions = [140, 250, 360];
  yardPositions.forEach((y) => {
    const bar = yard.clone();
    frame.appendChild(bar);
    centerNode(bar, frame);
    bar.y = y;
  });
  yard.remove();

  const sailsConfig = [
    { width: 210, height: 140, y: 80 },
    { width: 250, height: 170, y: 190 },
    { width: 180, height: 120, y: 310 },
  ];

  sailsConfig.forEach(({ width, height, y }) => {
    const sail = createSail(width, height, width * 0.35);
    frame.appendChild(sail);
    sail.x = frame.width / 2 - width / 2;
    sail.y = y;
  });

  const flag = figma.createVector();
  flag.vectorPaths = [{
    windingRule: 'NONZERO',
    data: `M0 0 L 0 35 L 80 20 Q 60 12 80 5 L 0 0 Z`,
  }];
  flag.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  flag.strokes = [];
  frame.appendChild(flag);
  flag.x = frame.width / 2 + 5;
  flag.y = 70;

  return frame;
}

const logoFrame = buildLogo();
buildSails();
figma.viewport.scrollAndZoomIntoView([logoFrame]);
figma.closePlugin('Galeonica assets added.');
