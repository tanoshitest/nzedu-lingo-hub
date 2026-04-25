import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Pencil, Lock, Unlock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { users as mockUsers, type User } from '@/data/mockData';

const roleColors: Record<string, string> = {
  'Quản trị viên': 'bg-destructive/10 text-destructive border-destructive/20',
  'Giáo vụ': 'bg-info/10 text-info border-info/20',
  'Giáo viên': 'bg-primary/10 text-primary border-primary/20',
  'Học viên': 'bg-success/10 text-success border-success/20',
};

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'Học viên' });

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    const newUser: User = {
      id: `U${String(users.length + 1).padStart(3, '0')}`,
      name: form.name,
      email: form.email,
      role: form.role as User['role'],
      status: 'Hoạt động',
    };
    setUsers([newUser, ...users]);
    setForm({ name: '', email: '', role: 'Học viên' });
    setOpen(false);
    toast.success('Đã thêm người dùng mới');
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role });
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    if (!form.name || !form.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setUsers(users.map((u) => u.id === editing.id ? { ...u, name: form.name, email: form.email, role: form.role as User['role'] } : u));
    toast.success('Đã cập nhật thông tin');
    setEditing(null);
  };

  const toggleLock = (u: User) => {
    const next = u.status === 'Hoạt động' ? 'Đã khóa' : 'Hoạt động';
    setUsers(users.map((x) => x.id === u.id ? { ...x, status: next } : x));
    toast.success(next === 'Đã khóa' ? `Đã khóa tài khoản ${u.name}` : `Đã mở khóa tài khoản ${u.name}`);
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    setUsers(users.filter((u) => u.id !== confirmDelete.id));
    toast.success(`Đã xóa ${confirmDelete.name}`);
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-hero shadow-elegant gap-2">
              <Plus className="h-4 w-4" />
              Thêm người dùng mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm người dùng mới</DialogTitle>
              <DialogDescription>Tạo tài khoản mới cho hệ thống NZEDU LMS</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nguyễn Văn A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@nzedu.vn" />
              </div>
              <div className="space-y-2">
                <Label>Vai trò</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                    <SelectItem value="Giáo vụ">Giáo vụ</SelectItem>
                    <SelectItem value="Giáo viên">Giáo viên</SelectItem>
                    <SelectItem value="Học viên">Học viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
              <Button onClick={handleAdd} className="gradient-hero">Thêm người dùng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/60">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => {
                const initials = u.name.split(' ').slice(-2).map((s) => s[0]).join('');
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="gradient-hero text-primary-foreground text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{u.name}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{u.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleColors[u.role]}>{u.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={u.status === 'Hoạt động' ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground'}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => startEdit(u)} className="gap-2">
                            <Pencil className="h-4 w-4" /> Sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleLock(u)} className="gap-2">
                            {u.status === 'Hoạt động'
                              ? <><Lock className="h-4 w-4" /> Khóa tài khoản</>
                              : <><Unlock className="h-4 w-4" /> Mở khóa</>}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setConfirmDelete(u)} className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" /> Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Không tìm thấy người dùng nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin {editing?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Họ và tên</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                  <SelectItem value="Giáo vụ">Giáo vụ</SelectItem>
                  <SelectItem value="Giáo viên">Giáo viên</SelectItem>
                  <SelectItem value="Học viên">Học viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Hủy</Button>
            <Button onClick={handleSaveEdit} className="gradient-hero">Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài khoản <strong>{confirmDelete?.name}</strong> ({confirmDelete?.email}) sẽ bị xóa khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsers;
