const faunadb = require('faunadb');
const client = new faunadb.Client({ secret: process.env.FAUNASECRET })
const app = require('express').Router();

// FQL functions
const {
    Ref,
    Paginate,
    Documents,
    Map,
    Get,
    Match,
    Select,
    Index,
    Create,
    Collection,
    Join,
    Call,
    Lambda,
    Var,
    Function: Fn,
} = faunadb.query;


app.get('/', (req, res) => {
    res.render('index.ejs')
})



// display form to post a new tweet:
app.get('/newtweet', async (req, res) => {

    try {
        const docs = await client.query(
            Map(
                Paginate(
                    Documents(
                        Collection('users')
                    )
                    
                ),
                Lambda(d => Get(d))
            )

            
        )

        let users = [];
        
        for(let i = 0; i < docs.data.length; i++) {
            users.push(docs.data[i].data.name);
        }

        res.render("newtweet", {users: users});

    } catch(err) {  
        res.send(err);
    }
});

// display the form to create a new user:
app.get('/newuser', (req, res) => {
    res.render('newuser', {err: null});
});

// Create a new user in the database:
app.post('/newuser', async (req, res) => {
    try {
        const docs = await client.query(
            Map(
                Paginate(
                    Documents(
                        Collection('users')
                    )
                    
                ),
                Lambda(d => Get(d))
            )

            
        )

        let users = [];
        
        for(let i = 0; i < docs.data.length; i++) {
            users.push(docs.data[i].data.name);
        }

        // ---------

        if(!users.includes(req.body.username.toLowerCase()) && req.body.username.trim().length !== 0) {
            const data = {
                name: req.body.username.trim()
            }
    
            const doc = await client.query(
                Create(
                    Collection('users'),
                    { data }
                )
            )
            .catch(err => res.send(err));
    
    
    
            res.redirect('/newtweet')
        } else {
            res.render('newuser', { err: 'username already exists' })
        }

        
        

    } catch(err) {  
        res.send(err);
    }
});

// post a tweet (user and text are hard coded at the moment)
app.post('/tweet', async (req, res) => {
    const data = {
        user: Call(Fn("getUser"), req.body.user), // user to make the tweet for
        text: req.body.text
    }

    const doc = await client.query(
        Create(
            Collection('tweets'),
            { data }
        )
    )

    
    // console.log(req.body)
    res.redirect('/all');

});


// Query all tweets: 
app.get('/all', async (req, res) => {
    try {
        const docs = await client.query(
            Map(
                Paginate(
                    Documents(
                        Collection('tweets')
                    )
                    
                ),
                Lambda(d => Get(d))
            )
        )

        let tweets = [];
        for(let i = 0; i < docs.data.length; i++) {
            let user = await client.query(
                Get(
                    Ref(
                        Collection('users'),
                        docs.data[i].data.user.id
                    )
                )
            );

            let data = {
                user: user.data.name,
                text: docs.data[i].data.text
            }
            
            tweets.push(data);

        }
        
        // res.send(tweets);
        res.render("all", {docs: tweets});

    } catch(err) {  
        res.send(err);
    }
});

module.exports = app;
