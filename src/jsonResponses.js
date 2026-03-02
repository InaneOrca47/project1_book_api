const books = require('../data/books.json');
const url = require('url');

const constructJSON = (content) => {
    return JSON.stringify(content);
}

const respondJSON = (request, response, status, content = "") => {
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    if (request.method !== 'HEAD' || status !== 204) {
        response.write(content);
    }

    response.end();
};

const responsdURLEncoded = (request, response, status, content = "") => {
    response.writeHead(status, {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    if (request.method !== 'HEAD' || status !== 204) {
        response.write(content);
    }

    response.end();
};

const getAuthor = (request, response) => {
    const urlParts = url.parse(request.url, true);
    const queryParams = urlParts.query;

    // set default
    let responseCode = 200;
    let responseJson = {
        message: 'Author found returning all books',
    }

    console.log(queryParams);

    if (!queryParams.author) {
        responseJson = {
            message: "Missing the necessary query parameters, all fields are required",
            id: "missingQueryParams"
        }
        const content = constructJSON(responseJson);

        return respondJSON(request, response, 400, content);
    }

    const returnedBooks = books.filter(b => b.author === queryParams.author);

    if (returnedBooks[0] === undefined) {
        responseCode = 404;
        responseJson.message = 'Error: Author not found';
        responseJson.id = 'resourceNotFound';

        const content = constructJSON(responseJson);

        return respondJSON(request, response, responseCode, content);
    }

    responseJson.books = returnedBooks;

    const content = constructJSON(responseJson);

    return respondJSON(request, response, responseCode, content);
}

const getLanguage = (request, response) => {
    const urlParts = url.parse(request.url, true);
    const queryParams = urlParts.query;

    // set default
    let responseCode = 200;
    let responseJson = {
        message: 'Language found returning all books',
    }

    console.log(queryParams);

    if (!queryParams.language) {
        responseJson = {
            message: "Missing the necessary query parameters, all fields are required",
            id: "missingQueryParams"
        }
        const content = constructJSON(responseJson);

        return respondJSON(request, response, 400, content);
    }

    const returnedBooks = books.filter(b => b.language === queryParams.language);

    if (returnedBooks[0] === undefined) {
        responseCode = 404;
        responseJson.message = 'Error: Language not found';
        responseJson.id = 'resourceNotFound';

        const content = constructJSON(responseJson);

        return respondJSON(request, response, responseCode, content);
    }

    responseJson.books = returnedBooks;

    const content = constructJSON(responseJson);

    return respondJSON(request, response, responseCode, content);
}

const getYear = (request, response) => {
    const urlParts = url.parse(request.url, true);
    const queryParams = urlParts.query;

    // set default
    let responseCode = 200;
    let responseJson = {
        message: 'Year found returning all books',
    }

    console.log(queryParams);

    if (!queryParams.year) {
        responseJson = {
            message: "Missing the necessary query parameters, all fields are required",
            id: "missingQueryParams"
        }
        const content = constructJSON(responseJson);

        return respondJSON(request, response, 400, content);
    }

    const returnedBooks = books.filter(b => b.year === parseInt(queryParams.year));

    if (returnedBooks[0] === undefined) {
        responseCode = 404;
        responseJson.message = 'Error: Year not found';
        responseJson.id = 'resourceNotFound';

        const content = constructJSON(responseJson);

        return respondJSON(request, response, responseCode, content);
    }

    responseJson.books = returnedBooks;

    const content = constructJSON(responseJson);

    return respondJSON(request, response, responseCode, content);
}

const getBooks = (request, response) => {
    const urlParts = url.parse(request.url, true);
    const queryParams = urlParts.query;

    // set default
    let responseCode = 200;
    let responseJson = {
        message: 'Book found',
    }

    if (!queryParams.title || !queryParams.author || !queryParams.language || !queryParams.year) {
        responseJson = {
            message: "Missing the necessary query parameters, all fields are required",
            id: "missingQueryParams"
        }
        const content = constructJSON(responseJson);

        return respondJSON(request, response, 400, content);
    }

    const book = books.find(
        b => b.title === queryParams.title
            && b.author === queryParams.author
            && b.language === queryParams.language
            && b.year === parseInt(queryParams.year));

    if (!book) {
        responseCode = 404;
        responseJson.message = 'Error: Book not found';
        responseJson.id = 'resourceNotFound';

        const content = constructJSON(responseJson);

        return respondJSON(request, response, responseCode, content);
    }

    responseJson.books = [book];

    const content = constructJSON(responseJson);

    return respondJSON(request, response, responseCode, content);
};

const addBook = (request, response) => {
    const responseJson = {
        message: '\'Title\', \'Author\', \'Language\' and \'Year\' are all required fields',
    }

    console.log(request.body);
    // check all the fields exist
    const { title, author, language, year } = request.body;

    // return badRequest if it does
    if (!title || !author || !language || !year) {
        responseJson.id = 'addBookMissingParams';
        const content = constructJSON(responseJson);
        return respondJSON(request, response, 400, content);
    }

    // check if the book already exists/ return conflict if it does

    const existingBook = books.find(
        b => b.title === title
            && b.author === author
            && b.language === language
            && b.year === year);
    if (existingBook) {
        responseJson.message = 'This book already exists in the data set';
        responseJson.id = 'resourceAlreadyExists';
        const content = constructJSON(responseJson);
        return respondJSON(request, response, 409, content);
    }

    let responseCode = 201;
    const index = books.length;

    books[index] = {
        "author": author,
        "language": language,
        "title": title,
        "year": parseInt(year),
    }

    if (responseCode === 201) {
        responseJson.message = 'Created Successfully';
        const content = constructJSON(books[index]);
        return respondJSON(request, response, responseCode, content);
    }

    return respondJSON(request, response, responseCode, JSON.stringify(responseJson));
};

const reviewBook = (request, response) => {
    const responseJson = {
        message: '\'Title\ and \'Score\' are all required fields',
    }

    console.log(request.body);
    // check all the fields exist
    const { title, score, } = request.body;

    if (!title || !score) {
        responseJson.id = 'reviewBookMissingParams';
        const content = constructJSON(responseJson);
        return respondJSON(request, response, 400, content);
    }

    const existingBook = books.findIndex(
        b => b.title === title);
    if (existingBook > -1) {
        responseJson.message = "Updated Successfully"
        books[existingBook].review = score;
        responseJson.books = [books[existingBook]];
        const content = constructJSON(responseJson);

        return respondJSON(request, response, 204, content);
    }

    let responseCode = 400;

    responseJson.message = "Cannot review a book not in the database"
    responseJson.id = "bookNotInDataBase";

    return respondJSON(request, response, responseCode, JSON.stringify(responseJson));
};

const notFound = (request, response) => {
    const responseJson = {
        message: "ERROR: Endpoint not found",
        id: "notFound"
    }

    return respondJSON(request, response, 404, JSON.stringify(responseJson));
}


module.exports = {
    getBooks,
    getAuthor,
    getLanguage,
    getYear,
    addBook,
    reviewBook,
    notFound,
}
