import { useState } from 'react';
import { toast } from 'sonner';
import IeltsTestList from '../ielts/IeltsTestList';
import IeltsTestEditor from '../ielts/IeltsTestEditor';
import IeltsTestForm from '../ielts/IeltsTestForm';
import { ieltsTests as seed, type IeltsTest } from '@/data/mockIeltsTests';

const AdminIeltsTests = () => {
  const [tests, setTests] = useState<IeltsTest[]>(seed);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const selected = tests.find((t) => t.id === selectedId) ?? null;

  const upsert = (t: IeltsTest) => {
    setTests((prev) => prev.some((x) => x.id === t.id) ? prev.map((x) => x.id === t.id ? t : x) : [...prev, t]);
  };

  const handleCreate = (t: IeltsTest) => {
    upsert(t);
    setSelectedId(t.id);
  };

  const handleDuplicate = (t: IeltsTest) => {
    const n = tests.length + 1;
    const copy: IeltsTest = {
      ...t,
      id: `IT-${Date.now()}`,
      code: `NZ-IELTS-${String(n).padStart(3, '0')}`,
      title: `${t.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    upsert(copy);
    toast.success('Test duplicated');
  };

  const handleDelete = (t: IeltsTest) => {
    setTests((prev) => prev.filter((x) => x.id !== t.id));
    toast.success('Test deleted');
  };

  const nextCodeNumber = tests.length + 1;

  if (selected) {
    return (
      <IeltsTestEditor
        test={selected}
        onChange={upsert}
        onBack={() => setSelectedId(null)}
        onDuplicate={handleDuplicate}
      />
    );
  }

  return (
    <>
      <IeltsTestList
        tests={tests}
        onOpen={(t) => setSelectedId(t.id)}
        onNew={() => setFormOpen(true)}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
      <IeltsTestForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onCreate={handleCreate}
        nextCodeNumber={nextCodeNumber}
      />
    </>
  );
};

export default AdminIeltsTests;
