// const zl = require('zip-lib')
// const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const { spawn } = require('child_process')

dotenv.config()

// const transporter = nodemailer.createTransport({
//   service: 'Mail.ru', // no need to set host or port etc.
//   auth: {
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASS
//   }
// })

// const mailOptions = {
//   from: process.env.MAIL_USER,
//   to: process.env.MAIL_USER,
//   subject: 'autodomcrm - mongodb backup',
//   text: `created at: ${new Date().toJSON()}`
// attachments: [
//   {
//     // filename and content type is derived from path
//     path: 'backup_db/mongodb.gz'
//   }
//   // {   // stream as an attachment
//   //     filename: 'text4.txt',
//   //     content: fs.createReadStream('file.txt')
//   // },
// ]
// }

const backupProcess = spawn('mongodump', ['--db=chat', '--archive=backup_db/mongodb.gz', '--gzip'])

const restoreToAtlasProcess = spawn('mongorestore', [
  '--drop',
  '--uri',
  process.env.MONGO_ATLAS,
  '--gzip',
  '--archive=backup_db/mongodb.gz'
])

const getIt = () =>
  backupProcess.on('exit', (code, signal) => {
    if (code) console.log('Backup process exited with code ', code)
    else if (signal) console.error('Backup process was killed with singal ', signal)
    else {
      console.log('Successfully backedup the database')
      // transporter.sendMail(mailOptions, function (error, info) {
      //   if (error) {
      //     console.log(error)
      //   } else {
      //     console.log(`Email sent: ${info.response}`)
      //   }
      // })
      restoreToAtlasProcess.on('exit', (cd, sg) => {
        if (cd) console.log('Restore process exited with code ', code)
        else if (sg) console.error('Restore process was killed with singal ', signal)
        else console.log('successfully restored to Atlas')
      })
    }
  })

setInterval(getIt, 72000000)
// getIt()
// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log(`Email sent: ${info.response}`)
//   }
// })

// zl.archiveFolder('database-backup/db', `database-backup/zip/mongodb.zip`).then(
//   function () {
//     console.log(`mongodb_${new Date().toJSON()}.zip is created`)

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error)
//       } else {
//         console.log(`Email sent: ${info.response}`)
//       }
//     })
//   },
//   function (err) {
//     console.log(err)
//   }
// )
