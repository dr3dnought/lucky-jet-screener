import { Telegraf } from "telegraf";
import Screener from "./screener";
import constants from "./utils/constants";
import logger from "./utils/log";

export default class ScreenerBot {
  private telegraf: Telegraf;

  private screener?: Screener;

  constructor(token: string) {
    this.telegraf = new Telegraf(token);

    //START
    this.telegraf.start((ctx) => {
      logger.debug(`Command /start has been cought`);

      if (!process.env.ONE_WIN_URL) {
        logger.error(constants.error_messages.one_win_url_not_found);
        throw new Error(constants.error_messages.one_win_url_not_found);
      }
      this.screener = new Screener(
        process.env.ONE_WIN_URL,
        parseInt(process.env.LIMIT || "2"),
        {
          onNewX: (cell) => {
            const mes = constants.bot_messages.new_x(cell);
            logger.info(mes);
            ctx.reply(mes);
          },
          onCircleSuccess: (cells) => {
            let coefCircleMessage = constants.bot_messages.success_circle;
            cells.forEach((cell) => {
              coefCircleMessage += cell.coefficient + " ";
            });
            ctx.reply(coefCircleMessage);
          },
          onError: (e) => {
            logger.error(e);
          },
        }
      );

      ctx.reply(constants.bot_messages.start);
    });

    //POLL
    this.telegraf.command(constants.commands.start_screening, (ctx) => {
      logger.debug(`Command /poll has been cought`);
      this.screener?.start();

      ctx.reply(constants.bot_messages.start_screening);
    });

    //STOP
    this.telegraf.command(constants.commands.stop, (ctx) => {
      logger.debug(`Command /stop has been cought`);
      this.screener?.stop();

      ctx.reply(constants.bot_messages.stop);
    });

    //SHOW
    this.telegraf.command(constants.commands.show_circle, (ctx) => {
      logger.debug(`Command /show has been cought`);
      ctx.reply(
        constants.bot_messages.get_circle(this.screener?.getCircle() || [])
      );
    });
  }

  start() {
    this.telegraf.launch();
  }
}
