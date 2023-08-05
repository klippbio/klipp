const express = require('express')
const app = express()


app.get("/api", (req, res) => {
    res.json({"users": ["user1", "user2", "sed"]})
})

app.listen(4000, () => console.log("Backend Server running on port 4000 🚀"))

