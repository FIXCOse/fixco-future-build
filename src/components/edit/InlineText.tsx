import { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import { useEditMode } from '@/stores/useEditMode';
import { cn } from '@/lib/utils';

interface InlineTextProps {
  id: string;               // t.ex. "home.hero.title"
  value: string;            // aktuellt värde att visa
  locale?: 'sv' | 'en';     // aktivt språk
  as?: keyof JSX.IntrinsicElements; // 'h1', 'p', 'span'
  onChange?: (next: string) => void; // kallas vid commit
  className?: string;
}

export function InlineText({
  id,
  value,
  locale = 'sv',
  as: Tag = 'span',
  onChange,
  className,
}: InlineTextProps) {
  // Stable selector to prevent re-renders
  const editState = useEditMode(
    useCallback((s) => ({
      isEditMode: s.isEditMode,
      canEdit: s.canEdit,
      stage: s.stage,
    }), [])
  );

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = useCallback(() => {
    const next = draft.trim();
    if (next !== value) {
      editState.stage(`content:${id}:${locale}`, { value: next }, 'content');
      onChange?.(next);
    }
    setEditing(false);
  }, [draft, value, editState.stage, id, locale, onChange]);

  const handleDoubleClick = useCallback(() => {
    if (editState.canEdit && editState.isEditMode) {
      setEditing(true);
    }
  }, [editState.canEdit, editState.isEditMode]);

  // Stable wrapper class calculation
  const wrapperClass = useMemo(() => cn(
    className,
    editState.canEdit && editState.isEditMode && 'relative group edit-safe'
  ), [className, editState.canEdit, editState.isEditMode]);

  if (editState.canEdit && editState.isEditMode) {
    return (
      <div className={wrapperClass}>
        {!editing ? (
          <button
            type="button"
            onDoubleClick={handleDoubleClick}
            className="inline-flex items-center gap-2 cursor-text outline-none text-left w-full"
            style={{ pointerEvents: 'auto', userSelect: 'text' }}
            aria-label="Redigera text"
          >
            {createElement(Tag, { className: "contents" }, value)}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1.5 py-0.5 rounded bg-foreground/10">
              ✎ Redigera
            </span>
          </button>
        ) : (
          <textarea
            ref={inputRef as any}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                commit();
              }
              if (e.key === 'Escape') {
                setEditing(false);
                setDraft(value);
              }
            }}
            className="min-w-[260px] w-full rounded border border-border bg-background/90 p-2 text-sm shadow focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            style={{ pointerEvents: 'auto' }}
            rows={3}
          />
        )}
        {/* Subtil highlight i edit-läge */}
        <span className="pointer-events-none absolute inset-0 rounded ring-1 ring-primary/0 group-hover:ring-primary/40" />
      </div>
    );
  }

  // Visningsläge (ingen redigering)
  return createElement(Tag, { className }, value);
}