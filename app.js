import express from 'express'

import { getUsers, getUser, createUser, updateUser, deleteUser } from './database.js'

const app = express()

app.use(express.json())

app.get("/users", async (req, res) => {
  const users = await getUsers()
  res.send(users)
})

app.get("/users/:id", async (req, res) => {
  const id = req.params.id
  const user = await getUser(id)
  res.send(user)
})

app.post("/users", async (req, res) => {
  const { username, email, password, phone_number } = req.body
  const user = await createUser(username, email, password, phone_number)
  res.status(201).send(user)
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