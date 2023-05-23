import express from 'express'

import bodyParser from 'body-parser'

import { getUsers, getUser, createUser, updateUser, deleteUser, createNewUser } from './database.js'
import stripe from 'stripe'
const stripeInstance = new stripe('sk_test_51NAAI5SBeM1tYIqmDZQS4DrmnINu8GYk0e14iRRqvpZ5EG6Tu4CubDspUnkYz1pYFFq2I11NOwP66RDJ09UiNubI00xZPG1hgw');
const app = express()


var Publishable_Key = 'pk_test_51NAAI5SBeM1tYIqmTF6eOTBwhPE6GrIIN5G3j8Avr4bCNQzswawWQNQoSzbYA4uj3Npt70EQGYyzWx3qAtudPPwl00TBof7L10'


app.use(express.json())
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

// RENDER HOME PAGE
app.get("/",function(req,res){
    res.render("registration-form");
});

// WILL GIVE THE COMPLETE USER DATABASE TO BROWSER
app.get("/users", async (req, res) => {
  const users = await getUsers()
  res.send(users)
})

// WILL GIVE THE INDIVIDUAL USER DATA TO BROWSER
app.get("/users/:id", async (req, res) => {
  const id = req.params.id
  const user = await getUser(id)
  res.send(user)
})

//INPUT THE USER DATA AND REDIRECT TO PAYMENT-GATEWAY PAGE
app.post("/users", async (req, res) => {
    const { username, email, password, phone_number } = req.body
    const user = await createUser(username, email, password, phone_number)
    res.redirect("/status/"+ user.id)
});

// RENDER THE PAYMENT LINK
app.get("/status/:id", async (req, res) => {
    const id = req.params.id;
    res.render('Home.ejs', {
            key: Publishable_Key,
            })
            })
        
// LINKED WITH HOME.EJS FILE AND GET SCRIPT DATA FROM IT
app.post('/payment/:id', function(req, res){
    const id = req.params.id;

    stripeInstance.products.create({
  name: 'Starter Subscription',
  description: '$12/Month subscription',
}).then(product => {
    stripeInstance.prices.create({
    unit_amount: 1200,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  }).then(price => {
    res.send('Success! Your Status is activated now!!')
  }).then( () => {
    return createNewUser(id)
  })
})	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

//UPDATE THE USER DATA IN THE DATABASE
app.patch("/users/:id", async (req, res) => {
    const id = req.params.id
    const { username, email, password, phone_number } = req.body
    const user = await updateUser(username, email, password, phone_number, id)
    res.send('Data updated successfully!', user)
  })

//DELETE THE USER DATA IN THE DATABASE
  app.delete("/users/:id",async (req, res) => {
    const id = req.params.id
    const user = await deleteUser(id)
    res.send('Deleted successfully!', user)
  })

//ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke 💩, You may have entered a duplicate username or email address')
})

//SERVER CREATOR
app.listen(8080, () => {
  console.log('Server is running on port 8080')
})