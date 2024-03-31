//go:build wasm
// +build wasm

package main

import (
	"encoding/json"
	"io"
	"syscall/js"

	"github.com/redraskal/r6-dissect/dissect"
	"github.com/rs/zerolog"
)

func convertForExport(v any) string {
	b, err := json.Marshal(v)
	if err != nil {
		return "{\"error\":\"something went wrong during json Marshal\"}"
	}
	return string(b)
}

type JSReader struct {
	io.Reader
	puller js.Value
}

func (r *JSReader) Read(destination []byte) (n int, err error) {
	source := r.puller.Invoke(len(destination))
	copied := js.CopyBytesToGo(destination, source)
	if copied == 0 {
		return 0, io.EOF
	} else {
		return copied, nil
	}
}

func dissectReadWrapper(_ js.Value, args []js.Value) any {
	puller := args[0]
	handler := func(_ js.Value, promiseArgs []js.Value) any {
		resolve := promiseArgs[0]
		reject := promiseArgs[1]

		if puller.IsUndefined() || puller.IsNull() {
			reject.Invoke(js.Global().Get("Error").New("No pull callback"))
		}

		read := &JSReader{puller: puller}
		result, error := dissect.NewReader(read)
		if error != nil {
			reject.Invoke(js.Global().Get("Error").New(error.Error()))
		}

		type round struct {
			dissect.Header
			MatchFeedback []dissect.MatchUpdate      `json:"matchFeedback"`
			PlayerStats   []dissect.PlayerRoundStats `json:"stats"`
		}
		resolve.Invoke(
			js.ValueOf(convertForExport(round{
				result.Header,
				result.MatchFeedback,
				result.PlayerStats(),
			})),
		)

		return nil
	}

	return js.Global().Get("Promise").New(js.FuncOf(handler))
}

func main() {
	zerolog.SetGlobalLevel(zerolog.Disabled)
	js.Global().Set("_internal_dissectReadWrapper", js.FuncOf(dissectReadWrapper))

	<-make(chan struct{})
}
