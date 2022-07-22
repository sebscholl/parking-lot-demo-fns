if (process.env.NODE_ENV != 'PRODUCTION') {
    const fs = require('fs')
    const path = require('path')

    fs.readFileSync(
        path.resolve(__dirname, '../../../.env.development'),
        { encoding: 'utf-8' }
    ).split(/\n/g)
     .forEach(line => {
         let [key, value] = line.split('=')
         process.env[key] = value
     });
}