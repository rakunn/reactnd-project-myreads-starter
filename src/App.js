import React from 'react';
import Search from './Search';
import BooksContainer from './BooksContainer';
import NoMatch from './NoMatch';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getAll, update } from './BooksAPI';
import './App.css';

class BooksApp extends React.Component {
  state = {
    books: []
  };

  componentDidMount() {
    getAll()
      .then(books => this.setState({ books }))
      .catch(err => console.log(err));
  }

  findBook(state, id) {
    return state.books.find(book => book.id === id);
  }

  updateShelf = (book, shelf) => {
    update(book, shelf)
      .then(data => {
        this.setState(prevState => {
          let newState = {...prevState};
          const foundBook = this.findBook(newState, book.id);

          if (foundBook) {
            shelf !== 'none'
              ? foundBook.shelf = shelf
              : delete foundBook.shelf;
          } else {
            book.shelf = shelf;
            newState.books.push(book);
          }
          return newState;
        })
      })
      .catch(err => console.log(err));
  };

  render() {
    const { books } = this.state;
    return (
      <Router>
        <div className="app">

          <h1 className="list-books-title"><span role="img" aria-label="book icon">📖</span> MyReads</h1>
          <Switch>
            <Route path={process.env.PUBLIC_URL + "/"} exact render={() => (
              <BooksContainer
                updateShelf = {this.updateShelf}
                books       = {books}
              /> )}
            />
            <Route path={process.env.PUBLIC_URL + "/search"} render={() => (
              <Search
                updateShelf = {this.updateShelf}
                books       = {books}
              />
            )} />
            <Route component = {NoMatch}/>
          </Switch>

        </div>
      </Router>
    );
  }
}

export default BooksApp;
