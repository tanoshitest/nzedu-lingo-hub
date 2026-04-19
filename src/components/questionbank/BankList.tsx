import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Copy, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  type BankItem, type BankSkill, type BankDifficulty,
  bankDifficultyColors, bankSkillColors,
} from '@/data/mockQuestionBank';
import { questionTypeLabels, presentationLabels } from '@/data/mockIeltsTests';

interface Props {
  items: BankItem[];
  onView: (item: BankItem) => void;
  onEdit: (item: BankItem) => void;
  onDuplicate: (item: BankItem) => void;
  onDelete: (item: BankItem) => void;
  onNew: () => void;
}

const BankList = ({ items, onView, onEdit, onDuplicate, onDelete, onNew }: Props) => {
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState<'all' | BankSkill>('all');
  const [diffFilter, setDiffFilter] = useState<'all' | BankDifficulty>('all');

  const filtered = items.filter((it) => {
    if (search) {
      const q = search.toLowerCase();
      const hay = [it.title, it.id, ...it.tags].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (skillFilter !== 'all' && it.skill !== skillFilter) return false;
    if (diffFilter !== 'all' && it.difficulty !== diffFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">Question Bank</h2>
          <p className="text-sm text-muted-foreground">
            {items.length} reusable question groups across Listening & Reading
          </p>
        </div>
        <Button onClick={onNew} className="gap-2 gradient-hero">
          <Plus className="h-4 w-4" /> New Bank Item
        </Button>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search title, ID or tag..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <Select value={skillFilter} onValueChange={(v) => setSkillFilter(v as any)}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="Listening">Listening</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
              </SelectContent>
            </Select>
            <Select value={diffFilter} onValueChange={(v) => setDiffFilter(v as any)}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Presentation</TableHead>
                <TableHead className="text-center">Q</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-center">Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    No items match.
                  </TableCell>
                </TableRow>
              ) : filtered.map((it) => (
                <TableRow key={it.id} className="cursor-pointer hover:bg-muted/40" onClick={() => onView(it)}>
                  <TableCell className="font-mono text-xs">{it.id}</TableCell>
                  <TableCell className="font-medium">{it.title}</TableCell>
                  <TableCell><Badge variant="outline" className={bankSkillColors[it.skill]}>{it.skill}</Badge></TableCell>
                  <TableCell className="text-xs">{questionTypeLabels[it.group.type]}</TableCell>
                  <TableCell className="text-xs">{presentationLabels[it.group.presentation]}</TableCell>
                  <TableCell className="text-center text-xs">{it.group.questions.length}</TableCell>
                  <TableCell><Badge variant="outline" className={bankDifficultyColors[it.difficulty]}>{it.difficulty}</Badge></TableCell>
                  <TableCell className="text-xs">
                    <div className="flex flex-wrap gap-1">
                      {it.tags.slice(0, 3).map((t, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0">{t}</Badge>
                      ))}
                      {it.tags.length > 3 && <span className="text-muted-foreground">+{it.tags.length - 3}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-xs">{it.usageCount}</TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onView(it)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(it)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDuplicate(it)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(it)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankList;
