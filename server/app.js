require('dotenv/config')
require('./utils/util.connection')
const app = require('express')()
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')(session)
const fallback = require('express-history-api-fallback')
const path = require('path')

const authRoute = require('./routes/route.auth')
const ongkirRoute = require('./routes/route.ongkir')
const socialAuthRoute = require('./routes/route.authsc')
const profileRoute = require('./routes/route.profile')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(
  cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: true
  })
)
app.use(
  session({
    name: 'express-session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    },
    store: new MongoStore({
      secret: process.env.SESSION_SECRET,
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 * 1000
    })
  })
)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(compression({ level: 9, strategy: 4 }))
app.use(passport.initialize())
app.use(passport.session())
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(process.cwd(), 'client/build')))
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(process.cwd(), 'client/build/index.html'))
  })
}

app.use(socialAuthRoute)
app.use('/api', authRoute)
app.use('/api', ongkirRoute)
app.use('/api', profileRoute)

app.listen(process.env.PORT, () => console.log(`server is running on ${process.env.PORT}`))
