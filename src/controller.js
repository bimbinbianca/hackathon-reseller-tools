import { nanoid } from 'nanoid';
import books from '../src/books.js';

//menyimpan buku
export const savingBook = (req, res) => {
    const { name, year, author, summary, publisher, pageCount
        , readPage, reading
    } = req.body;

    //tidak melampirkan properti name pada request body
    if (!name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
    }

    //masukin nilai properti readPage yang lebih besar dari pageCount
    if (readPage > pageCount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = { id, name, year, author, summary, publisher, pageCount
        , readPage, finished, reading, insertedAt, updatedAt
    };

    books.push(newBook);

    const successBook = books.filter((book) => book.id === id).length > 0;

    if (successBook) {
        return res.status(201).json({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: { bookId : id }
        });
    }
};

//menampilkan buku
export const getaBook = (req, res) => {
    const { name, reading, finished} = req.query;

    let filteredBooks = [...books];

    //filter berdasarkan Nama (?name)
    if (name !== undefined) {
        filteredBooks= filteredBooks.filter((book) => 
        book.name.toLowerCase().includes(name.toLowerCase()));
    }

    // filter berdasarkan status baca (?reading)
    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => 
            book.reading === (reading === '1')
        );
    }

    // filter berdasarkan status selesai (?finished)
    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => 
        book.finished === (finished === '1'));
    }

    return res.status(200).json({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
};

//menampilkan buku spesifik
export const getaBookById = (req, res) => {
    const { bookId } = req.params;
    const book = books.find((b) => b.id === bookId);

    if (book) {
        return res.status(200).json({
            status: 'success',
            data: { book }
        });
    }
    return res.status(404).json({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    });
};

//API dapat mengubah data buku
export const editBookById = (req, res) => {
    const { bookId } = req.params;
    const { name, year, author, summary, publisher, pageCount, 
        readPage, reading } = req.body;

    if (!name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
    }

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const index = books.findIndex((n) => n.id === bookId);

    if (index !== -1) {
        books[index] = { ...books[index], name, year, author, summary, publisher, pageCount
        , readPage, finished, reading, updatedAt };
        return res.status(200).json({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
    }
    return res.status(404).json({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
};

//API dapat menghapus buku
export const deleteBookById = (req, res) => {
    const { bookId } = req.params;
    const index = books.findIndex((n) => n.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        return res.status(200).json({
            status: 'success',
            message: 'Buku berhasil dihapus'
        });
    }
    return res.status(404).json({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
};

