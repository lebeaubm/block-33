const pg = require('pg')
const client = new pg.Client('postgres://localhost/gamestore')

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())



//GET all video games
app.get('/api/videogames', async(req, res, next) => {
    try {
        let SQL = `
            SELECT * FROM videogames;
        `
        let response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

//GET single video game
app.get('/api/videogames/:id', async(req, res, next) => {
    try {
        let SQL = `
            SELECT * FROM videogames
            WHERE id = $1;
        `
        let response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})











//GET all board games
app.get('/api/boardgames', async(req, res, next) => {
    try {
        console.log("api/boardgames")
        let SQL = `
            SELECT * FROM boardgames;
        `
        let response = await client.query(SQL) 
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

//GET single board game
app.get('/api/boardgames/:id', async(req, res, next) => {
    try {
        let SQL = `
            SELECT * FROM boardgames
            WHERE id = $1;
        `
        let response = await client.query(SQL, [req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})



//DELETE a board game
app.delete('/api/boardgames/:id', async(req, res, next) => {
    try {
        let SQL = `
            DELETE FROM boardgames WHERE id = $1;
        `
        let response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

//DELETE a video game
app.delete('/api/videogames/:id', async(req, res, next) => {
    try {
        let SQL = `
            DELETE FROM videogames WHERE id = $1;
        `
        let response = await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})





//POST a board game
app.post('/api/boardgames', async(req, res, next) => {
    try {
        let SQL = `
            INSERT INTO boardgames (name, Rating) 
            VALUES ($1, $2)
            RETURNING *
        `
        let response = await client.query(SQL, [req.body.name, req.body.Rating])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

//POST a video game
app.post('/api/videogames', async(req, res, next) => {
    try {
        let SQL = `
            INSERT INTO videogames (name, Rating) 
            VALUES ($1, $2)
            RETURNING *
        `
        let response = await client.query(SQL, [req.body.name, req.body.Rating])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

//PUT (update) individual board games
app.put('/api/boardgames/:id', async (req, res, next) => {
    try {
        const SQL = `
            UPDATE boardgames
            SET name = $1, Rating = $2
            WHERE id = $3
            RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.Rating, req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
}) 

//PUT (update) individual video games
app.put('/api/videogames/:id', async (req, res, next) => {
    try {
        const SQL = `
            UPDATE videogames
            SET name = $1 Rating = $2
            WHERE id = $3
            RETURNING *
        `
        const response = await client.query(SQL, [req.body.name, req.body.Rating, req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
}) 

const start = async() => {
    await client.connect()
    console.log("connected to database")

    let SQL = `
        DROP TABLE IF EXISTS videogames;
        DROP TABLE IF EXISTS boardgames;

        CREATE TABLE videogames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(60),
            Rating DECIMAL
        );

        CREATE TABLE boardgames(
            id SERIAL PRIMARY KEY,
            name VARCHAR(60),
            Rating DECIMAL
        );




        
        INSERT INTO videogames (name, Rating) VALUES ('BG3', 11);
        INSERT INTO videogames (name, Rating) VALUES ('Marvels spiderman 2', 9.5);
        INSERT INTO videogames (name, Rating) VALUES ('Star wars', 9);
        INSERT INTO videogames (name, Rating) VALUES ('Legend of Zelda', 8);

        INSERT INTO boardgames (name, Rating) VALUES ('D&D', 10);
        INSERT INTO boardgames (name, Rating) VALUES ('Marvels BGRPG', 9);
        INSERT INTO boardgames (name, Rating) VALUES ('Star wars BGRPG', 7);
        INSERT INTO boardgames (name, Rating) VALUES ('LEgend of zelda BG', 5);

        
    `

    await client.query(SQL)
    console.log('table created and data seeded')

    const port = process.env.PORT || 8080
    app.listen(port, () => {
        console.log(` listening on port ${port}`)
    })
}

start()