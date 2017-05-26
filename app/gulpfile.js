const gulp = require('gulp');
const chalk = require('chalk');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const spawn = require('child_process').spawn;
const runSequence = require('run-sequence');
const PrettyError = require('pretty-error');
const eslint = require('gulp-eslint');
const minimist = require('minimist');

const pe = new PrettyError();
pe.skip(() => true);

const options = minimist(process.argv.slice(2));
const watchDir = options.watch || './src/**/*.js';
const nodeEntry = options.node_entry || 'build/index.js';
const port = parseInt(process.env.PORT, 10) || 3000;
const isInteractive = process.stdout.isTTY;

const DUMMY_ERROR = 'DUMMY_ERROR';
let node;

function startNode() {
  node = spawn('node', [nodeEntry]);
  console.log(`Node has restarted and running at:`);
  console.log();
  console.log(chalk.cyan(`  http://0.0.0.0:${port}`));
  console.log();
  console.log(chalk.grey('__________________________________'));
  console.log();
  node.stdout.on('data', data => {
    console.log(`${data}`);
  });
  node.stderr.on('data', data => {
    console.log(chalk.red(data));
  });
}

function clearConsole() {
  if (isInteractive) {
    process.stdout.write(
      process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H'
    );
  }
}

gulp.task(
  'restart',
  () =>
    new Promise((resolve, reject) => {
      if (node) {
        node.on('close', code => {
          startNode();
          if (code === 8) {
            reject('Error detected, waiting for changes...');
          }
          resolve();
        });
        node.kill();
      } else {
        startNode();
        resolve();
      }
    })
);

gulp.task(
  'lint',
  () =>
    new Promise((resolve, reject) => {
      let errorCount = 0;
      gulp
        .src(watchDir)
        .on('data', () => {
          clearConsole();
          console.log();
          console.log('Linting...');
        })
        .pipe(eslint())
        .on('data', () => {
          clearConsole();
        })
        .pipe(eslint.format('stylish', process.stderr))
        .pipe(
          eslint.results(results => {
            errorCount = results.errorCount;
          })
        )
        .on('finish', function onFinish() {
          if (errorCount > 0) {
            this.emit('end');
            reject(DUMMY_ERROR);
          } else {
            console.log();
            console.log(chalk.green(`Eslint ✅`));
            resolve();
          }
        });
    })
);

gulp.task(
  'build',
  () =>
    new Promise((resolve, reject) => {
      let error;
      gulp
        .src(watchDir)
        .pipe(plumber())
        .pipe(babel())
        .on('error', function onError(err) {
          error = err;
          this.emit('end');
        })
        .pipe(gulp.dest('build'))
        .on('finish', function onFinish() {
          if (error) {
            console.log();
            console.log(chalk.red(`Could not transpile ❌`));
            console.log();
            this.emit('end');
            reject(error);
          } else {
            console.log();
            console.log(chalk.green(`Babel ✅`));
            console.log();
            resolve();
          }
        });
    })
);

gulp.task('watch', () => {
  const stream = watch(watchDir, { ignoreInitial: false }, () => {
    runSequence('lint', 'build', 'restart', error => {
      if (error && error.message !== DUMMY_ERROR) {
        const renderedError = pe.render(error);
        console.log(renderedError);
      }
    });
  });

  stream.on('ready', () => {
    clearConsole();
  });
  stream.on('change', file => {
    clearConsole();
    console.log();
    console.log(`File ${file} has changed`);
    console.log();
  });
});

gulp.task('default', ['watch']);
