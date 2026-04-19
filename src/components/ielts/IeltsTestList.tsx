import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Copy, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  type IeltsTest, type IeltsVariant, type IeltsSkill, type TestStatus,
  testStatusColors,
} from '@/data/mockIeltsTests';

interface Props {
  tests: IeltsTest[];
  readOnly?: boolean;
  onOpen: (t: IeltsTest) => void;
  onNew?: () => void;
  onDuplicate?: (t: IeltsTest) => void;
  onDelete?: (t: IeltsTest) => void;
}

const skillBadgeClass: Record<IeltsSkill, string> = {
  Listening: 'bg-info/10 text-info border-info/20',
  Reading: 'bg-primary/10 text-primary border-primary/20',
  Writing: 'bg-warning/10 text-warning border-warning/20',
  Speaking: 'bg-success/10 text-success border-success/20',
};

const IeltsTestList = ({ tests, readOnly, onOpen, onNew, onDuplicate, onDelete }: Props) => {
  const [search, setSearch] = useState('');
  const [variantFilter, setVariantFilter] = useState<'all' | IeltsVariant>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TestStatus>('all');
  const [skillFilter, setSkillFilter] = useState<'all' | IeltsSkill>('all');

  const filtered = tests.filter((t) => {
    if (search && !(t.title.toLowerCase().includes(search.toLowerCase()) || t.code.toLowerCase().includes(search.toLowerCase()))) return false;
    if (variantFilter !== 'all' && t.variant !== variantFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (skillFilter !== 'all' && !t.skills.includes(skillFilter)) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-xl font-bold">IELTS Test Library</h2>
          <p className="text-sm text-muted-foreground">
            {readOnly ? 'Browse published IELTS tests' : 'Design and manage IELTS test papers'}
          </p>
        </div>
        {!readOnly && onNew && (
          <Button onClick={onNew} className="gap-2 gradient-hero">
            <Plus className="h-4 w-4" /> New Test
          </Button>
        )}
      </div>

      <Card className="border-border/60">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search title or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <Select value={variantFilter} onValueChange={(v) => setVariantFilter(v as any)}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="Variant" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Variants</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="General Training">General Training</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={(v) => setSkillFilter(v as any)}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Skill" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="Listening">Listening</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
                <SelectItem value="Writing">Writing</SelectItem>
                <SelectItem value="Speaking">Speaking</SelectItem>
              </SelectContent>
            </Select>
            {!readOnly && (
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Skills</TableHead>
                {!readOnly && <TableHead>Status</TableHead>}
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={readOnly ? 6 : 7} className="text-center text-muted-foreground py-8">
                    No tests match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((t) => (
                  <TableRow key={t.id} className="cursor-pointer hover:bg-muted/40" onClick={() => onOpen(t)}>
                    <TableCell className="font-mono text-xs">{t.code}</TableCell>
                    <TableCell className="font-medium">{t.title}</TableCell>
                    <TableCell><Badge variant="outline">{t.variant}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {t.skills.map((s) => (
                          <Badge key={s} variant="outline" className={skillBadgeClass[s]}>{s}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <Badge variant="outline" className={testStatusColors[t.status]}>{t.status}</Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-xs text-muted-foreground">{t.updatedAt}</TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onOpen(t)}>
                          {readOnly ? <Eye className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                        </Button>
                        {!readOnly && onDuplicate && (
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDuplicate(t)}>
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {!readOnly && onDelete && (
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(t)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IeltsTestList;
