import fetch from "node-fetch";
import { CoefficientCell } from "./data";

type TLastXResponse = {
  id: number;

  coefficient: number;
};

export const fetchLastX = async (url: string): Promise<CoefficientCell> => {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { session: "demo" },
    });
    const data = (await res.json()) as TLastXResponse;

    return Promise.resolve(new CoefficientCell(data.id, data.coefficient));
  } catch (e) {
    return Promise.reject(e);
  }
};
