const FRAME_SIZE = 500;
const OUTER_SIZE = 420;
const INNER_SIZE = 276; // outer minus 2*72
const ROTATION = 15;
const STROKE_EQUIV = 36;

function centerNode(node: SceneNode & { width: number; height: number }, parent: FrameNode) {
  node.x = parent.width / 2 - node.width / 2;
  node.y = parent.height / 2 - node.height / 2;
}

function createLogoFrame(): FrameNode {
  const frame = figma.createFrame();
  frame.name = 'Galeonica Logo';
  frame.resize(FRAME_SIZE, FRAME_SIZE);
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

function buildLogo(): void {
  const page = figma.currentPage;
  const frame = createLogoFrame();
  page.appendChild(frame);
  frame.x = figma.viewport.center.x - FRAME_SIZE / 2;
  frame.y = figma.viewport.center.y - FRAME_SIZE / 2;

  // Base diamond
  const outer = createRotatedRect(OUTER_SIZE, frame);

  // Inner cutout + crossbar + tail union (white shapes)
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

  const unionSubtract = figma.union([inner, crossbar, tail], frame);

  const logoShape = figma.booleanOperation('SUBTRACT', outer, unionSubtract);
  logoShape.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
  logoShape.strokes = [];

  // Clean up stray nodes (union consumed originals automatically)
  frame.appendChild(logoShape);
  figma.currentPage.selection = [logoShape];
  figma.viewport.scrollAndZoomIntoView([logoShape]);
}

buildLogo();
figma.closePlugin('Galeonica logo added.');
