import { CoefficientCell } from "../screener/data";

export default {
  error_messages: {
    bot_token_not_found: `Variable "BOT_TOKEN" was not found in .env`,
    one_win_url_not_found: '`Variable "ONE_WIN_URL" was not found in .env`',
  },
  commands: {
    start_screening: "screen",
    clearHistory: "clear",
    stop: "stop",
    show_circle: "show",
  },
  bot_messages: {
    success_circle: "🏆 Удачный круг, вот последние коэфициенты: ",
    start:
      "👋 Привет, я бот скринер, напиши /screen чтобы я начал отслеживать иксы!",
    stop: "⛔️ Отслеживание приостановлено, введите /screen, чтобы начать отслеживание снова",
    start_screening: "🚀 Начинаю отслеживание!...",
    new_x: (cell: CoefficientCell) => {
      return `🔥 Новый X: { id: ${cell.id} coefficient: ${cell.coefficient} }`;
    },
    get_circle: (cells: CoefficientCell[]) => {
      let message = "📦 Вот список иксов, которые сейчас в кругу:";
      cells.forEach((cell) => {
        message += `\n{ id: ${cell.id} coefficient: ${cell.coefficient} }`;
      });

      return message;
    },
  },
};
