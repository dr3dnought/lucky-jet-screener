import ScreenerBot from "./bot";
import constants from "./utils/constants";
import logger from "./utils/log";

if (!process.env.BOT_TOKEN) {
  logger.error(constants.error_messages.bot_token_not_found);
  throw Error(constants.error_messages.bot_token_not_found);
}

const bot = new ScreenerBot(process.env.BOT_TOKEN);
bot.start();
logger.success("Bot has been started successfully");
