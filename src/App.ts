import * as express from 'express'
import * as logger from 'morgan'



class App{
    public express

    constructor () {
        this.express = express()
        this.express.use(express.static('public'))
        logger('tiny')
        this.express.use(logger('dev'))
        this.mountRoutes()
    }

    private mountRoutes(): void {
        const router = express.Router()

        router.get('/', (req,res) => {
            res.json({
                message: 'Hello World!'
            })
        })

        router.get('/deathRolling', (req,res) => {
            res.send()
        })
        this.express.use('/',router)
    }
}
export default new App().express