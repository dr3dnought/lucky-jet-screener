import { RingBuffer } from "ring-buffer-ts";
import logger from "../utils/log";
import { CoefficientCell } from "./data";
import { fetchLastX } from "./requests";

type TScreenerEventHandler = {
  onLastX?: (cell: CoefficientCell) => void;

  onNewX?: (cell: CoefficientCell) => void;

  onCircleSuccess?: (cell: CoefficientCell[]) => void;

  onCircleFail?: () => void;

  onError?: (error: Error) => void;
};

export default class Screener {
  private url: string;

  private handler: TScreenerEventHandler = {};

  private fetchLastXTimerHandler: NodeJS.Timeout = setInterval(() => {});

  private cellRingBuffer: RingBuffer<CoefficientCell>;

  constructor(
    url: string,
    circleSize: number = 7,
    handler?: TScreenerEventHandler
  ) {
    this.url = url;
    if (handler) {
      this.handler = handler;
    }
    this.cellRingBuffer = new RingBuffer<CoefficientCell>(circleSize);
  }

  start() {
    this.fetchLastXTimerHandler = setInterval(() => {
      fetchLastX(this.url)
        .then((cell) => {
          if (this.handler.onLastX) {
            this.handler.onLastX(cell);
          }

          /* @describe
           * if buffer is empty, add new cell without any check
           */
          if (this.cellRingBuffer.isEmpty()) {
            logger.debug("LAST X: Circle Buffer is empty");
            this.cellRingBuffer.add(cell);
            return;
          }

          /* @describe
           * if buffer has last X, check if new X is next after previous
           * if TRUE, call onNewX,
           * if FALSE, clear buffer
           */
          if (this.cellRingBuffer.getLast()) {
            if (cell.id - this.cellRingBuffer.getLast()!.id == 1) {
              console.log(
                `FIRST ${cell.id} second: ${this.cellRingBuffer.getLast()!.id}`
              );
              this.cellRingBuffer.add(cell);
              if (this.handler.onNewX) {
                this.handler.onNewX(cell);
              }
            } else {
              this.cellRingBuffer.clear();
              this.cellRingBuffer.add(cell);
            }
          }

          /* @describe
           * if buffer has success circle, call onCircleSuccess
           */
          if (this.cellRingBuffer.isFull()) {
            if (
              this.cellRingBuffer.toArray().filter((cell) => cell.isSuccess)
                .length == this.cellRingBuffer.getSize()
            ) {
              if (this.handler.onCircleSuccess) {
                this.handler.onCircleSuccess(this.cellRingBuffer.toArray());
              }
              this.cellRingBuffer.clear();
            }
          }
        })
        .catch((e) => {
          if (this.handler.onError) {
            this.handler.onError(e);
          }
          this.cellRingBuffer.clear();
        });
    }, parseInt(process.env.INTERVAL || "1000"));
  }

  stop() {
    clearInterval(this.fetchLastXTimerHandler);
  }

  getCircle() {
    return this.cellRingBuffer.toArray();
  }
}
