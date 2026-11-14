import { Pencil } from 'lucide-react';
import { useLeaf, type QuickEditTarget } from '../context/LeafContext';

interface EditTriggerButtonProps {
  target: QuickEditTarget;
  label?: string;
  className?: string;
}

export function EditTriggerButton({
  target,
  label = '사진 · 글 수정',
  className = '',
}: EditTriggerButtonProps) {
  const { isEditMode, setQuickEditTarget } = useLeaf();

  if (!isEditMode || !target) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuickEditTarget(target);
      }}
      className={`inline-flex min-h-[34px] items-center gap-1.5 rounded-md border border-[#26364C] bg-[#FFFFFF]/95 px-3 py-1 text-xs font-medium text-[#26364C] shadow-sm transition-colors hover:bg-[#26364C] hover:text-[#F5F1E9] ${className}`}
    >
      <Pencil className="h-3 w-3" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
