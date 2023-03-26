import fetch from "node-fetch";

export const PORT = 4004;
export const BASE_URL = `http://localhost:${PORT}`;

export const client = {
  get: (url: string) => fetch(`${BASE_URL}${url}`).then((res) => res.json()),
  post: (url: string, body: any) =>
    fetch(`${BASE_URL}${url}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json()),
};
