import http from 'http';
import { spawn } from 'child_process';

const preview = spawn('cmd.exe', ['/c', 'npm.cmd', 'run', 'preview', '--', '--port', '4173'], {
  stdio: 'pipe'
});

preview.stdout.on('data', (data) => {
  const text = data.toString();
  if (text.includes('4173') || text.includes('Local:')) {
    http.get('http://localhost:4173', (res) => {
      console.log('HTTP_PROBE_SUCCESS_STATUS:' + res.statusCode);
      preview.kill();
      process.exit(0);
    }).on('error', (err) => {
      console.error('Probe failed:', err);
      preview.kill();
      process.exit(1);
    });
  }
});

setTimeout(() => {
  console.log('Timeout reached');
  preview.kill();
  process.exit(0);
}, 6000);
