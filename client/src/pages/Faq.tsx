import { useEffect, useMemo, useState } from 'react';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';

import {
  Pencil,
  Plus,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFaq } from '@/hooks/use-faq';
import type { FaqResponse } from '@/types/faq';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';

function FaqPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<number | null>(null);
  const {
    loading,
    dataFaqs,
    faqForm,
    fetchFaqs,
    createFaq,
    setFaqForm,
    getFaqById,
    updateFaq,
    deleteFaq,
  } = useFaq();
  const navigate = useNavigate();
  useEffect(() => {
    fetchFaqs(page, search);
  }, [page, search]);

  useEffect(() => {}, [mode]);

  useEffect(() => {
    console.log('faq form changed', faqForm);
  }, [faqForm]);

  const faqSchema = z.object({
    question: z
      .string()
      .min(1, 'กรุณากรอกคำถาม')
      .max(255, 'คำถามต้องไม่เกิน 255 ตัวอักษร'),

    answer: z.string().min(1, 'กรุณากรอกคำตอบ'),
  });

  const [errors, setErrors] = useState<{
    question?: string;
    answer?: string;
  }>({});

  type FaqFormData = z.infer<typeof faqSchema>;

  const data = useMemo<FaqResponse[]>(() => dataFaqs?.data ?? [], [dataFaqs]);

  const handleOpenDialog = async (type: 'create' | 'edit', id?: number) => {
    setMode(type);
    setEditId(type === 'edit' && id ? id : null);

    if (type === 'create') {
      setFaqForm({
        question: '',
        answer: '',
      });
    } else {
      if (id) {
        const data = await getFaqById(id);
        setFaqForm({
          question: data?.question ?? '',
          answer: data?.answer ?? '',
        });
      }
    }

    setErrors({});
    setIsOpenDialog(true);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = faqSchema.safeParse(faqForm);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        question: fieldErrors.question?.[0],
        answer: fieldErrors.answer?.[0],
      });

      return;
    }

    setErrors({});

    try {
      if (mode === 'edit' && editId) {
        await updateFaq(editId);
      } else {
        await createFaq();
      }

      setFaqForm({
        question: '',
        answer: '',
      });

      setIsOpenDialog(false);
      setEditId(null);
      setPage(1);
      setSearch(searchInput);
      await fetchFaqs(page, search);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteFaq(deleteId);
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
      await fetchFaqs(page, search);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    setPage(1);
    setSearch(searchInput);
  };

  const form = useForm<FaqFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: '',
      answer: '',
    },
  });

  const columns = useMemo<ColumnDef<FaqResponse>[]>(
    () => [
      {
        accessorKey: 'question',
        header: () => <div className="font-semibold px-3">คำถาม</div>,
        cell: ({ row }) => (
          <div className="max-w-md whitespace-normal px-3">
            {row.original.question}
          </div>
        ),
      },
      {
        accessorKey: 'answer',
        header: () => <div className="font-semibold">คำตอบ</div>,
        cell: ({ row }) => (
          <div className="max-w-lg whitespace-normal">
            {row.original.answer}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => <div className="text-center font-semibold">จัดการ</div>,
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              onClick={() => {
                handleOpenDialog('edit', row.original.id);
              }}
              variant="ghost"
              size="icon"
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              onClick={() => {
                setDeleteId(row.original.id);
                setIsDeleteDialogOpen(true);
              }}
              variant="ghost"
              size="icon"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: dataFaqs?.total_pages ?? 1,
  });

  const totalPages = dataFaqs?.total_pages ?? 1;
  const currentPage = dataFaqs?.page ?? page;

  function previousPage() {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans">
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8 lg:py-10 ">
        <div className="space-y-6 w-full">
          <Card className="px-4">
            <CardHeader className="px-0">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/')}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <CardTitle className="font-bold">FAQ Management</CardTitle>
                </div>

                <Button
                  className="bg-sky-200 text-slate-700 font-semibold hover:bg-sky-300 hover:text-slate-800 transition-colors"
                  onClick={() => handleOpenDialog('create')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create FAQ
                </Button>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <div className="relative w-full md:w-1/2">
                  <Input
                    placeholder="Search FAQ..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    className="pr-10"
                  />

                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>

                <Button
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                  onClick={handleSearch}
                >
                  <Search className="mr-2 h-4 w-4" />
                  ค้นหา
                </Button>
              </div>
            </CardHeader>
            <CardContent className="rounded-lg border px-0">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        ไม่พบข้อมูลที่ค้นหา
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex items-center justify-end gap-3 border-t bg-background px-4 py-4">
                <Button
                  variant="outline"
                  onClick={previousPage}
                  disabled={currentPage <= 1 || loading}
                >
                  <ChevronLeft className="ml-2 h-4 w-4" />
                  ก่อนหน้า
                </Button>

                <span className="min-w-[80px] text-center text-sm text-muted-foreground">
                  หน้า {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage >= totalPages || loading}
                >
                  ถัดไป
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
          <Spinner className="size-20 text-blue-500" />
        </div>
      )}
      <Dialog open={!!isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="w-[95vw] md:w-[40vw] max-w-2xl md:max-w-4xl p-0 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="px-6 py-4">
              <DialogTitle className="text-xl font-semibold">
                {mode === 'create'
                  ? 'เพิ่มคำถามที่พบบ่อย (FAQ)'
                  : 'แก้ไขคำถามที่พบบ่อย (FAQ)'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 px-6">
              <div className="space-y-1">
                <Label className="font-semibold pb-2">คำถาม</Label>

                <Input
                  value={faqForm.question}
                  onChange={(e) =>
                    setFaqForm((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  placeholder="กรอกคำถาม"
                  className={
                    errors.question
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />

                {errors.question && (
                  <p className="text-sm text-red-500">{errors.question}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="font-semibold  pb-2">คำตอบ</Label>

                <Textarea
                  value={faqForm.answer}
                  onChange={(e) =>
                    setFaqForm((prev) => ({
                      ...prev,
                      answer: e.target.value,
                    }))
                  }
                  placeholder="กรอกคำตอบ"
                  rows={6}
                  className={
                    errors.answer
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }
                />

                {errors.answer && (
                  <p className="text-sm text-red-500">{errors.answer}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setIsOpenDialog(false);
                }}
              >
                ยกเลิก
              </Button>

              <Button
                className="bg-[#84a98c] hover:bg-[#6f8f77]"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md p-0 ">
          <DialogHeader className="px-6 py-4 ">
            <DialogTitle className="text-xl font-semibold ">
              ยืนยันการลบ
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground px-6 ">
            คุณต้องการลบคำถามนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
            <Button
              className="w-full sm:w-18"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
              }}
            >
              ยกเลิก
            </Button>
            <Button
              className="w-full sm:w-18 bg-red-400 text-white hover:bg-red-500 transition-colors"
              variant="default"
              onClick={handleDelete}
            >
              ลบ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default FaqPage;
