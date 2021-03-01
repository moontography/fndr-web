const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

gulp.task('start', function(done) {
  const stream = nodemon({
    exec: 'npm run start',
    ext: 'ts',
    tasks: ['build'],
    watch: ['src'],
    done: done,
  })

  stream.on('crash', function() {
    console.error('Application has crashed!\n')
    stream.emit('restart', 10) // restart the server in 10 seconds
  })
  return stream
})
