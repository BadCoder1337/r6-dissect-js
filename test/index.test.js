import { Dissect } from "../dist";
import { readFile } from "node:fs/promises";

test("can read a replay", async () => {
	const dissect = new Dissect();
	await dissect.init();
	const result = await dissect.read(new Blob([await readFile("./replays/ranked_1.rec")]));
	expect(result).toBe(JSON.parse(await readFile("./replays/ranked_1.rec.json", "utf8")));
});

// test("can read a match", async () => {
// 	const { data, error } = await dissectMatch("replays/Match-2023-06-10_01-28-10-228");
// 	expect(error).toBeUndefined();
// 	expect(data?.rounds).toBeArrayOfSize(1);
// });

// test("cannot read non-existant file", async () => {
// 	const { data, error } = await dissect("nooooooooo");
// 	expect(data).toBeUndefined();
// 	expect(error).toBe("stat nooooooooo: no such file or directory");
// });
