# Generated gRPC Types

These files are auto-generated from `../trader.proto` by [ts-proto](https://github.com/stephenh/ts-proto).

**Do not edit manually.** Any manual changes will be overwritten the next time codegen runs.

## Regenerating

```sh
npm run proto:gen
```

This requires `protoc` (the Protocol Buffers compiler) to be installed on your system:

- macOS: `brew install protobuf`
- Ubuntu/Debian: `apt install protobuf-compiler`
- Or download from https://github.com/protocolbuffers/protobuf/releases

## CI enforcement

CI runs `npm run proto:check` which regenerates the files and then fails if the working tree is dirty. If CI fails on this check, run `npm run proto:gen` locally and commit the updated generated files.

## Current state

`trader.ts` is currently a hand-written placeholder that mirrors the proto messages exactly. It will be replaced by actual `protoc` output once the codegen pipeline runs for the first time.
