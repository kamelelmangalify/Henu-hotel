const { execSync } = require('child_process');

function run(cmd) {
  console.log(`> ${cmd}`);
  const out = execSync(cmd, { cwd: __dirname, encoding: 'utf8' });
  console.log(out);
}

try {
  run('git checkout --orphan temp_branch');
  run('git add .');
  run('git commit -m "Initial commit of Antigravity AI Orchestrator and Hotel System"');
  run('git branch -D main');
  run('git branch -m main');
  console.log('Clean commit complete! Ready to push.');
} catch (e) {
  console.error('Error:', e.message);
}
