export const game = new PIXI.Application({
  width: 500,
  height: 500,
});

document.body.append(game.view);

export function createRootContainer() {
  return game.stage;
}
