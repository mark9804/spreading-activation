// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mitt from "mitt";

export type Events = {
  enterKeyPressed: void;
  taskEnd: void;
  experimentEnd: void;
};
export const eventBus = mitt<Events>();
