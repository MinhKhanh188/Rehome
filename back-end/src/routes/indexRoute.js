// routes/indexRoute.js
function index(app) {

    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to ReHome API' });
    })
}

module.exports = index