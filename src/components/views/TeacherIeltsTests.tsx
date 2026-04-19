import { useState } from 'react';
import IeltsTestList from '../ielts/IeltsTestList';
import IeltsTestEditor from '../ielts/IeltsTestEditor';
import { ieltsTests, type IeltsTest } from '@/data/mockIeltsTests';

const ReadOnlyIeltsTests = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const published = ieltsTests.filter((t) => t.status === 'Published');
  const selected = published.find((t) => t.id === selectedId) ?? null;

  if (selected) {
    return (
      <IeltsTestEditor
        test={selected}
        onChange={() => { /* read-only */ }}
        onBack={() => setSelectedId(null)}
        readOnly
      />
    );
  }

  return (
    <IeltsTestList
      tests={published}
      onOpen={(t: IeltsTest) => setSelectedId(t.id)}
      readOnly
    />
  );
};

export default ReadOnlyIeltsTests;
