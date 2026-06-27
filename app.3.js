const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "notes.index.html"));
});

app.post("/addNote", (req, res) => {

    const noteData =
        `Date: ${req.body.date}
Note: ${req.body.note}
---------------------
`;

    fs.appendFileSync("notes.txt", noteData);

    /*
  res.send(`
        <h2>Note Saved Successfully</h2>
        <a href="/notes.index.html">Go Back</a>
    `);
     redirect hatakar success stylish page bna rhi hu for better design jiske liye css use hoga*/

     res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Success</title>

<style>

body{
    font-family:'Segoe UI',sans-serif;
    background:linear-gradient(135deg,#ffd6e8,#ffeaf4,#fff0f7);
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.card{
    background:white;
    padding:40px;
    border-radius:20px;
    text-align:center;
    box-shadow:0 8px 25px rgba(255,105,180,0.25);
}

h1{
    color:#d63384;
}

p{
    color:#555;
    font-size:18px;
}

a{
    display:inline-block;
    margin-top:20px;
    background:#ff69b4;
    color:white;
    text-decoration:none;
    padding:12px 20px;
    border-radius:10px;
}

a:hover{
    background:#ff1493;
}

</style>

</head>

<body>

<div class="card">

<h1>🎉 Note Saved Successfully! 🎀</h1>

<p>Your note has been stored safely.</p>

<a href="/notes.index.html">🏠 Back To Home</a>

</div>

</body>

</html>
`);
});

app.get("/notes", (req, res) => {

    let notes = "";

    if (fs.existsSync("notes.txt")) {
        notes = fs.readFileSync("notes.txt", "utf8");
    }

 /* phele yeh code tha but i want style in notes list so i used another code for styling
res.send(`
<h1>All Notes</h1>

<pre>${notes}</pre>
<a href="/notes.index.html">Go Back</a>

<form action="/delete" method="POST">
    <input type="date" name="date" required>
    <button type="submit">Delete Note</button>
</form>

<br>

`);*/

res.send(`
<!DOCTYPE html>
<html>
<head>
<title>All Notes</title>

<style>

body{
    font-family:'Segoe UI',sans-serif;
    background:linear-gradient(135deg,#ffd6e8,#ffeaf4,#fff0f7);
    padding:30px;
}

.container{
    max-width:800px;
    margin:auto;
    background:white;
    padding:25px;
    border-radius:20px;
    box-shadow:0 8px 25px rgba(255,105,180,0.25);
}

h1{
    text-align:center;
    color:#d63384;
}

pre{
    background:#fff5fa;
    padding:20px;
    border-radius:15px;
    border:2px solid #ffc2d9;
    white-space:pre-wrap;
    font-size:16px;
}

button{
    background:#ff69b4;
    color:white;
    border:none;
    padding:12px;
    border-radius:10px;
    cursor:pointer;
}

button:hover{
    background:#ff1493;
}

input{
    padding:10px;
    border-radius:8px;
    border:1px solid #ccc;
}

.back-btn{
    display:inline-block;
    margin-top:20px;
    text-decoration:none;
    background:#ff85c2;
    color:white;
    padding:10px 15px;
    border-radius:10px;
}

</style>

</head>

<body>

<div class="container">

<h1>🎀 My Notes Collection 🎀</h1>

<pre>${notes}</pre>

<h3>🗑 Delete Note By Date</h3>

<form action="/delete" method="POST">

<input type="date" name="date" required>

<button type="submit">
Delete Note
</button>

</form>

<br>

<a href="/notes.index.html
" class="back-btn">
⬅ Go Back Home
</a>

</div>

</body>
</html>
`);

});

app.post("/delete",(req,res)=>{

    const deleteDate=req.body.date;

    let notes=fs.readFileSync(
        "notes.txt",
        "utf8"
    );

    let allNotes=
        notes.split("---------------------");

    allNotes=allNotes.filter(note=>
        !note.includes(deleteDate)
    );

    fs.writeFileSync(
        "notes.txt",
        allNotes.join("---------------------")
    );
/*
    res.send(`
        <h2>Note Deleted Successfully</h2>
        <br><a href="/notes">Go Back</a>
    `);*/
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Delete Success</title>

<style>

body{
    font-family:'Segoe UI',sans-serif;
    background:linear-gradient(135deg,#ffd6e8,#ffeaf4,#fff0f7);
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
}

.card{
    background:white;
    padding:40px;
    border-radius:20px;
    text-align:center;
    box-shadow:0 8px 25px rgba(255,105,180,0.25);
}

h1{
    color:#ff1493;
}

p{
    color:#666;
    font-size:18px;
}

a{
    display:inline-block;
    margin-top:20px;
    background:#ff69b4;
    color:white;
    text-decoration:none;
    padding:12px 20px;
    border-radius:10px;
    font-weight:bold;
}

a:hover{
    background:#ff1493;
}

</style>

</head>

<body>

<div class="card">

<h1>🗑️ Note Deleted Successfully 🎀</h1>

<p>The selected note has been removed.</p>

<a href="/notes">🏠 Back To Home</a>

</div>

</body>
</html>
`);

});

app.post("/filter", (req, res) => {

    const filterDate = req.body.filterDate;

    if (!fs.existsSync("notes.txt")) {
        return res.send("No notes found");
    }

    const notes = fs.readFileSync("notes.txt", "utf8");

    const allNotes = notes.split("--------------------");

    let result = "";

    allNotes.forEach(note => {
        if (note.includes(filterDate)) {
            result += note + "<hr>";
        }
    });

    if (result === "") {
        result = "<h3>No Notes Found For This Date</h3>";
    }

   /* res.send(`
        <h1>Filtered Notes</h1>
        ${result}
        <br><a href="/notes.index.html">Go Back</a>
    `); */
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Filtered Notes</title>

<style>

body{
    font-family:'Segoe UI',sans-serif;
    background:linear-gradient(135deg,#ffd6e8,#ffeaf4,#fff0f7);
    display:flex;
    justify-content:center;
    align-items:center;
    min-height:100vh;
}

.card{
    width:700px;
    background:white;
    padding:30px;
    border-radius:20px;
    box-shadow:0 8px 25px rgba(255,105,180,0.25);
}

h1{
    text-align:center;
    color:#d63384;
}

.notes{
    background:#fff5fa;
    padding:20px;
    border-radius:15px;
    border:2px solid #ffc2d9;
    margin-top:20px;
}

a{
    display:inline-block;
    margin-top:20px;
    background:#ff69b4;
    color:white;
    text-decoration:none;
    padding:12px 20px;
    border-radius:10px;
}

a:hover{
    background:#ff1493;
}

</style>

</head>

<body>

<div class="card">

<h1>🎀 Filtered Notes 🎀</h1>

<div class="notes">
${result}
</div>

<center>
<a href="/notes.index.html">🏠 Back To Home</a>
</center>

</div>

</body>
</html>
`);
});

app.listen(3000, () => {
    console.log("Server running on 3000");
});