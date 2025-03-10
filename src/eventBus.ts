// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import mitt from "mitt";

export type Events = {
  enterDebugMode: void;
};
export const eventBus = mitt<Events>();
