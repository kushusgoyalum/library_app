import express from 'express'

import bodyParser from 'body-parser'

import { getUsers, getUser, createUser, updateUser, deleteUser } from './database.js'
import stripe from 'stripe'
const stripeInstance = new stripe('sk_test_51NAAI5SBeM1tYIqmDZQS4DrmnINu8GYk0e14iRRqvpZ5EG6Tu4CubDspUnkYz1pYFFq2I11NOwP66RDJ09UiNubI00xZPG1hgw');
const app = express()

var Publishable_Key = 'pk_test_51NAAI5SBeM1tYIqmTF6eOTBwhPE6GrIIN5G3j8Avr4bCNQzswawWQNQoSzbYA4uj3Npt70EQGYyzWx3qAtudPPwl00TBof7L10'



app.use(express.json())
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.render("registration-form");
});

app.get("/users", async (req, res) => {
  const users = await getUsers()
  res.send(users)
})

app.get("/users/:id", async (req, res) => {
  const id = req.params.id
  const user = await getUser(id)
  res.send(user)
//   res.render('Home.ejs', {
//     key: Publishable_Key
//     })
    // res.redirect("/payment" + user.id)

})

app.post("/users", async (req, res) => {
    const { username, email, password, phone_number } = req.body
    const user = await createUser(username, email, password, phone_number)
    res.redirect("/xyz/"+ user.id)
});

app.get("/xyz/:id", async (req, res) => {
    const id = req.params.id;
    res.render('Home.ejs', {
            key: Publishable_Key,
            id: id
            })
            } )
        


app.post('/payment', function(req, res){
    // const id = req.params.id;

    console.log(req.body)

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
  });
})	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

app.patch("/users/:id", async (req, res) => {
    const id = req.params.id
    const { username, email, password, phone_number } = req.body
    const user = await updateUser(username, email, password, phone_number, id)
    res.send('Data updated successfully!', user)
  })

  app.delete("/users/:id",async (req, res) => {
    const id = req.params.id
    const user = await deleteUser(id)
    res.send('Deleted successfully!', user)
  })


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke 💩')
})

app.listen(8080, () => {
  console.log('Server is running on port 8080')
})