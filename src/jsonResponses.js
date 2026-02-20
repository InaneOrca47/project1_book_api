const books = require('../data/books.json');
const query = require('querystring');

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

const searchBooks = ({ title, author, language, year }) => {

    let responseJSON = {};
    for (const i of books) {
        if (books[i].title === title && books[i].author === author && books[i].language === language && books[i].year === year) {
            responseJSON += books[i];
        }
    }

    return responseJSON;
}

const getBooks = (request, response) => {
    const queryParams = query.parse(request.query);

    if (queryParams) {
        const responseJSON = {
            message: "Missing the necessary query parameters, all fields are required",
            id: "missingQueryParams"
        }
        const content = constructJSON(responseJSON);

        return respondJSON(request, response, 400, content);
    }

    const responseJSON = searchBooks(
        {
            title: queryParams.title,
            author: queryParams.author,
            language: queryParams.language,
            year: queryParams.year
        });

    // if()

    const content = constructJSON(responseJSON);

    return respondJSON(request, response, 200, content);
};

const addBook = (request, response) => {
    const responseJson = {
        message: '\'Title\', \'Author\', and \'Language\' are all required fields',
    }

    // check all the fields exist
    const { title, author, language, year } = request.body;

    // return badRequest if it does
    if (!title || !author || !language || !year) {
        responseJson.id = 'addBookMissingParams';
        const content = constructJSON(responseJson);
        return respondJSON(request, response, 400, content);
    }

    // check if the book already exists/ return conflict if it does
    for (const i of books) {
        if (books[i].title === title && books[i].author === author && books[i].language === language && books[i].year === year) {
            responseJson.message = 'This book already exists in the data set';
            responseJson.id = 'resourceAlreadyExists';
            const content = constructJSON(responseJson);
            return respondJSON(request, response, 409, content);
        }
    }

    let responseCode = 201;
    // if (!books[title]) {
    //     users[title] = {
    //         title: title,
    //     };
    // }

    // users[title].author = author;
    // users[title].language = language;
    books[books.length] = {
        "title": title,
        "author": author,
        "language": language,
        "year": year,
    }

    if (responseCode === 201) {
        responseJson.message = 'Created Successfully';
        const content = constructJSON(responseJson);
        return respondJSON(request, response, responseCode, content)
    }

    return respondJSON(request, response, responseCode);
};


module.exports = {
    getBooks,
    addBook,
}
