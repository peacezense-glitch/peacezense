#!/usr/bin/env node
/**
 * Standalone ngrok tunnel for Metro (port 8081).
 * Reconnects without restarting Metro when Expo's bundled tunnel drops.
 */
import ngrok from '@expo/ngrok';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const ROOT = process.cwd();
const SUBDOMAIN = process.env.EXPO_TUNNEL_SUBDOMAIN || 'peacezense5841';
const PORT = Number(process.env.METRO_PORT || 8081);
const AUTH_TOKEN =
  process.env.NGROK_AUTHTOKEN ||
  process.env.EXPO_NGROK_AUTH_TOKEN ||
  '5W1bR67GNbWcXqmxZzBG1_56GezNeaX6sSRvn8npeQ8';
const STATUS_FILE = join(ROOT, '.expo/preview-status.json');
const LOG_PREFIX = '[peacezense-tunnel]';

mkdirSync(join(ROOT, '.expo'), { recursive: true });

function log(...args) {
  console.log(`${LOG_PREFIX}`, ...args);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function writeStatus(state, webUrl = '', expUrl = '') {
  const fallbackWeb = `https://${SUBDOMAIN}.ngrok.io`;
  const web = webUrl || fallbackWeb;
  const exp = expUrl || `exp://${web.replace(/^https?:\/\//, '')}`;
  writeFileSync(
    STATUS_FILE,
    JSON.stringify(
      {
        state,
        webUrl: web,
        expUrl: exp,
        subdomain: SUBDOMAIN,
        persistent: true,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );
}

async function metroHealthy() {
  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/status`);
    return res.ok;
  } catch {
    return false;
  }
}

async function publicHealthy(webUrl) {
  try {
    const res = await fetch(`${webUrl}/status`, { signal: AbortSignal.timeout(8000) });
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForMetro() {
  for (let i = 0; i < 90; i++) {
    if (await metroHealthy()) return true;
    await sleep(2000);
  }
  return false;
}

async function connectOnce() {
  const configPath = join(homedir(), '.expo', 'ngrok.yml');
  let closed = false;

  try {
    await ngrok.kill();
  } catch {
    // ignore stale ngrok processes
  }
  await sleep(500);

  const publicUrl = await ngrok.connect({
    subdomain: SUBDOMAIN,
    authtoken: AUTH_TOKEN,
    configPath,
    port: PORT,
    onStatusChange(status) {
      log(`ngrok status: ${status}`);
      if (status === 'closed') closed = true;
    },
  });

  const host = publicUrl.replace(/^https?:\/\//, '');
  const expUrl = `exp://${host}`;
  writeStatus('running', publicUrl, expUrl);
  log(`live web=${publicUrl} exp=${expUrl}`);

  while (!closed) {
    if (!(await metroHealthy())) {
      log('Metro offline — waiting for Metro to return');
      writeStatus('metro_offline', publicUrl, expUrl);
      break;
    }
    if (!(await publicHealthy(publicUrl))) {
      log('Public tunnel health check failed');
      writeStatus('tunnel_offline', publicUrl, expUrl);
      break;
    }
    writeStatus('running', publicUrl, expUrl);
    await sleep(5000);
  }

  try {
    await ngrok.disconnect(publicUrl);
  } catch {
    // ignore
  }
  try {
    await ngrok.kill();
  } catch {
    // ignore
  }
}

log(`Starting tunnel manager (subdomain=${SUBDOMAIN}, port=${PORT})`);
writeStatus('starting');

while (true) {
  if (!(await waitForMetro())) {
    log('Metro not ready on port', PORT);
    writeStatus('waiting_for_metro');
    await sleep(5000);
    continue;
  }

  try {
    await connectOnce();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log('connect error:', message);
    writeStatus('error');
    try {
      await ngrok.kill();
    } catch {
      // ignore
    }
  }

  log('Reconnecting tunnel in 2s...');
  writeStatus('reconnecting');
  await sleep(2000);
}
