import React from 'react';
import RemotePage from '../components/RemotePage';

const WEBSITE_URL = 'https://jlptburmese.com';

export default function WebsiteScreen() {
  return (
    <RemotePage
      url={WEBSITE_URL}
      title="JLPT Burmese website"
      description="The website needs an internet connection. Your bundled grammar, Kanji, reading, and vocabulary content remains available offline in the other tabs."
    />
  );
}
