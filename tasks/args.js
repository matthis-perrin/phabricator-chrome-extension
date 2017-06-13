import yargs from 'yargs';

const args = yargs
  .option('production', {
    boolean: true,
    default: false,
    describe: 'Minify all scripts and assets'
  })
  .argv

export default args;

