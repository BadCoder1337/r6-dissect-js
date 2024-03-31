import "./wasm_exec.js";
// import wasm from "./lib/main.wasm?url";

export class Dissect {
	url = new URL("./dissect.wasm", import.meta.url);
	go = new Go();

	async init() {
		await this.#initNode();
	}

	async #initNode() {
		const { readFile } = await import("node:fs/promises");
		const result = await WebAssembly.instantiate(await readFile(this.url), this.go.importObject);
		this.go.run(result.instance);
	}

	async read(round: Blob) {
		if (this.go.exited) await this.init();
		const buf = await round.arrayBuffer();
		let i = 0;
		const res = await _internal_dissectReadWrapper((n) => {
			const part = new Uint8Array(buf, i, n % (buf.byteLength - i));
			console.log("🚀 ~ Dissect ~ pull %s at %s of total %s result %s", n, i, buf.byteLength, part.length);
			i += n;
			return part;
		});
		return JSON.parse(res) as Dissect.Replay;
	}
}
