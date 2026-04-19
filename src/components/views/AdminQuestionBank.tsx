import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useBankItems, bankStore } from '../questionbank/bankStore';
import { bankDifficultyColors, bankSkillColors, type BankItem } from '@/data/mockQuestionBank';
import BankList from '../questionbank/BankList';
import BankItemDialog from '../questionbank/BankItemDialog';
import QuestionGroupCard from '../ielts/shared/QuestionGroupCard';

const AdminQuestionBank = () => {
  const items = useBankItems();
  const [editing, setEditing] = useState<BankItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewing, setViewing] = useState<BankItem | null>(null);
  const [deleting, setDeleting] = useState<BankItem | null>(null);

  const handleNew = () => {
    setEditing(null);
    setEditDialogOpen(true);
  };

  const handleEdit = (item: BankItem) => {
    setEditing(item);
    setEditDialogOpen(true);
  };

  const handleDuplicate = (item: BankItem) => {
    const copy: BankItem = {
      ...item,
      id: `QB-${Date.now()}`,
      title: `${item.title} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
      group: { ...item.group, id: `BANK-QG-${Date.now()}` },
    };
    bankStore.upsert(copy);
    toast.success('Bank item duplicated');
  };

  const handleDelete = (item: BankItem) => setDeleting(item);

  const confirmDelete = () => {
    if (deleting) {
      bankStore.remove(deleting.id);
      toast.success('Bank item deleted');
      setDeleting(null);
    }
  };

  return (
    <>
      <BankList
        items={items}
        onView={setViewing}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onNew={handleNew}
      />

      <BankItemDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        initial={editing}
        onSave={(item) => bankStore.upsert(item)}
      />

      {/* Preview dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap">
                  <span>{viewing.title}</span>
                  <Badge variant="outline" className={bankSkillColors[viewing.skill]}>{viewing.skill}</Badge>
                  <Badge variant="outline" className={bankDifficultyColors[viewing.difficulty]}>{viewing.difficulty}</Badge>
                </DialogTitle>
                <DialogDescription className="font-mono text-xs">{viewing.id} • used {viewing.usageCount}×</DialogDescription>
              </DialogHeader>
              {(viewing.passageExcerpt || viewing.audioContext) && (
                <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    {viewing.skill === 'Reading' ? 'Passage Excerpt' : 'Audio Context'}
                  </div>
                  {viewing.passageExcerpt ?? viewing.audioContext}
                </div>
              )}
              <QuestionGroupCard group={viewing.group} readOnly />
              {viewing.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {viewing.tags.map((t, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bank item?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && `"${deleting.title}" will be removed. Tests that previously imported this item will not be affected (snapshot copies stay in place).`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminQuestionBank;
