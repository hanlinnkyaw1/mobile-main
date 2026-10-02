import React from 'react';
import RemotePage from '../components/RemotePage';

const BOOK_STORAGE_URL = 'https://www.jlptburmese.com/bookStroage/bookstorage.html';

export default function BookStorageScreen() {
  return (
    <RemotePage
      url={BOOK_STORAGE_URL}
      title="Free book"
      description="This page lists downloadable Japanese study books, old JLPT questions, and additional learning resources. It requires an internet connection."
    />
  );
}
