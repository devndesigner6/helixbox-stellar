# HelixBox Stellar CLI

Node.js CLI that connects a local machine to the Helix Box mobile app through the Helix Box gateway. It runs from the project directory you want to expose and keeps filesystem, terminal, process, port, git, and AI actions scoped to that working tree.

## Requirements

- Node.js 18 or newer
- npm
- Helix Box mobile app for QR/session pairing

## Usage

The Stellar package is not published yet. Build and run the local version:

```bash
npm ci --ignore-scripts
npm run build
node dist/index.js
```

The CLI prints a QR code and session details. Scan the QR code with the Helix Box app to connect to the current working directory.

## Model tools

Pairing, workspace controls and access to your installed Codex/Claude Code are free. Their own provider subscriptions remain separate.

The live model catalog is available when the Stellar manager is configured. Stellar x402 payments, model purchases, and recovery are not available yet. The CLI does not receive a wallet signing key.

Common options:

```bash
node dist/index.js --help
node dist/index.js --new
node dist/index.js --debug
node dist/index.js --extra-ports 3000,8080
```

Options:

| Option | Description |
| --- | --- |
| `-h`, `--help` | Show CLI help |
| `-n`, `--new` | Create a fresh session code instead of reusing the saved one |
| `-d`, `--debug` | Enable verbose CLI and AI backend logs |
| `--extra-ports` | Comma-separated local ports to expose through Helix Box |

## Configuration

Set both environment variables to the separate Stellar services or local infrastructure:

```bash
HELIXBOX_PROXY_URL=http://localhost:3001 \
HELIXBOX_MANAGER_URL=http://localhost:3002 \
node dist/index.js
```

Other useful environment variables:

| Variable | Description |
| --- | --- |
| `HELIXBOX_PROXY_URL` | Gateway/proxy URL |
| `HELIXBOX_MANAGER_URL` | Manager URL |
| `HELIXBOX_DEBUG` | Set to `1` for debug logging |
| `HELIXBOX_DEBUG_AI` | Set to `1` for AI backend debug logging |
| `NO_COLOR` | Disable colored terminal output |
| `FORCE_COLOR` | Force colored terminal output |

Session config is saved per project root in the OS-specific Helix Box config directory:

- macOS: `~/Library/Application Support/helixbox-stellar/config.json`
- Windows: `%APPDATA%\helixbox-stellar\config.json`
- Linux: `$XDG_CONFIG_HOME/helixbox-stellar/config.json` or `~/.config/helixbox-stellar/config.json`

## Development

Install dependencies:

```bash
npm install
```

Build the CLI:

```bash
npm run build
```

Run from source output:

```bash
npm run dev
```

The package entrypoint is `dist/index.js`, generated from `src/index.ts`. `npm run build` compiles TypeScript and marks the generated entrypoint executable.

## Project Layout

```text
src/
  index.ts              CLI entrypoint and local machine bridge
  ai/                   Codex, OpenCode, Claude Code and Hermes integration
  transport/            Session transport protocol
  libsodium-wrappers.d.ts
```

## Publishing

The package is named `helixbox-stellar-cli` and is not published yet. `prepublishOnly` runs the production build before publishing.

```bash
npm publish
```
