const express = require('express')
const app = require('express')()
const mongoose = require('mongoose');
const port = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }));
const { FemaleData, MaleData } = require('./models/DataOfDB');
app.set('view engine', 'ejs')
app.use(express.static('public'))

//auto-refresh
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
 
 
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});



app.get('/',
    (req, res) => { 
        res.sendFile("./views/signin.html", { root: __dirname }) }
)


mongoose
    .connect("mongodb+srv://islam:foCqra7jHPaalMfq@cluster0.w1n39hw.mongodb.net/all-data?retryWrites=true&w=majority")
        .then(
            () => { app.listen(port, console.log(`http://localhost:${port}/`))
            }
        )
        .catch(
            (error,res) => {console.log(error) 
            res.send("<h1> error de conecter avec MongoseDB")}
        );

app.post("/", (req, res) => {
    const gender = req.body.gender;
                
    if (gender === "male") {
        const pack_male = new MaleData(req.body);
        pack_male.save()
            .then(() => {
            
            MaleData.find()
                .then((result) => {
                    
                    console.log(result.at(-1).Username);
                    res.render("after_signin.ejs", { arrobj: result, gender });
                            })
                .catch((error) => {
                    console.log(error);
                    res.send("<h1>Données non trouvées");
                            });
                    })
            .catch((error) => {
                console.log(error);
                res.send("<h1> Les données n'ont pas été enregistrées");
                    });
    } else {
                
    const pack_female = new FemaleData(req.body);
    pack_female.save()
        .then(() => {
            FemaleData.find()
                .then((result) => {
                    console.log(result.at(-1).Username);
                    res.render("after_signin.ejs", { arrobj: result,gender });
                            })
                .catch((error) => {
                    console.log(error);
                    res.send("<h1>Données non trouvées</h1>");
                            });
                    })
        .catch((error) => {
            console.log(error);
            res.send("<h1> Les données n'ont pas été enregistrées</h1>");
                    });
            }
        });

        

