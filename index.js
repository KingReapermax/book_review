import express from "express";
import pg from 'pg';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', 'views');

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'book_notes',
    password: '123456',
    port: 5432
});

db.connect();

var books = [{
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    rating: 5,
    review: 'A classic novel about the American Dream. Really love it. You should read it sometime for sure.',
    ISBN: '9780743273565'
}];
app.get('/', async (req, res) => {
    try{
        try{
            const result = await db.query('SELECT * FROM books');
            books = result.rows;
            
            res.render('home.ejs', {books: books});
        }catch(err){
            console.log(err);
        }
        
    }catch(err){
        console.log(err);                                                                                                                                           
    }
});
app.get('/add', (req, res)=>{
    res.render('modify.ejs');
})
app.get('/edit/:id', async (req, res)=>{
    const id = req.params.id;
   
    try{
        const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        const book = result.rows[0];
        res.render('modify.ejs', {book: book});
    }catch(err){
        console.log(err);
    }
    
});
app.get('/delete/:id', async (req, res)=>{
    const id = req.params.id;
    
    try{
        await db.query('DELETE FROM books WHERE id = $1', [id]);
        res.redirect('/');
        //code here
    }catch(err){
        console.log(err);
    }
});
app.post('/added', async (req, res)=>{
    const book = req.body;
    console.log(book);
    try{
        await db.query('insert into books (title, author, year, rating, review, isbn) values ($1, $2, $3, $4, $5, $6)', [book.title, book.author, book.year, book.rating,book.review, book.isbn]);
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
    //code here
    
});
app.post('/edited/:id', (req, res)=>{
    const id = req.params.id;
    const book = req.body;
    try{
        db.query('UPDATE books SET title = $1, author = $2, year = $3, rating = $4, review = $5, isbn = $6 WHERE id = $7', [book.title, book.author, book.year, book.rating, book.review, book.isbn, id]);
        console.log(book);
        res.redirect('/');
    }catch(err){
        console.log(err);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
