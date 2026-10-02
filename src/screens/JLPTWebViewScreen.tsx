import React from 'react';
import RemotePage from '../components/RemotePage';

const MOCK_EXAM_URL = 'https://jlptburmese.com/jlpt-mock-exam/jlptmocktest.html';

export default function JLPTWebViewScreen() {
  return (
    <RemotePage
      url={MOCK_EXAM_URL}
      title="JLPT mock exam"
      description="The JLPT mock exam runs on jlptburmese.com and needs an internet connection. Please connect to Wi-Fi or mobile data and try again."
    />
  );
}
