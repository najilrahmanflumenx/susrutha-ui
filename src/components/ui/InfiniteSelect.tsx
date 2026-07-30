'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Search, Loader2, X, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  sublabel?: string;
}

interface InfiniteSelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, option?: SelectOption) => void;
  options?: SelectOption[];
  fetchOptions?: (query: string, page: number) => Promise<{ options: SelectOption[]; hasMore: boolean }>;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export const InfiniteSelect: React.FC<InfiniteSelectProps> = ({
  label,
  placeholder = 'Select an option...',
  value,
  onChange,
  options = [],
  fetchOptions,
  className = '',
  required = false,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<SelectOption[]>(options);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fetchOptions && options) {
      setItems(options);
    }
  }, [options, fetchOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadOptions = useCallback(
    async (query: string, pageNum: number, isNewSearch: boolean = false) => {
      if (!fetchOptions || isLoading) return;
      setIsLoading(true);
      try {
        const res = await fetchOptions(query, pageNum);
        if (isNewSearch) {
          setItems(res.options);
        } else {
          setItems((prev) => [...prev, ...res.options]);
        }
        setHasMore(res.hasMore);
      } catch (err) {
        console.error('Error fetching options:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchOptions, isLoading]
  );

  useEffect(() => {
    if (fetchOptions && isOpen) {
      setPage(1);
      const timer = setTimeout(() => {
        loadOptions(searchQuery, 1, true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isOpen]);

  const handleScroll = () => {
    if (!listRef.current || !fetchOptions || !hasMore || isLoading) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollHeight - scrollTop <= clientHeight + 30) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOptions(searchQuery, nextPage, false);
    }
  };

  const filteredItems = fetchOptions
    ? items
    : items.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.sublabel && item.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const selectedItem = items.find((item) => item.value === value) || options.find((item) => item.value === value);

  return (
    <div className={`space-y-2 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block font-sans text-xs font-bold uppercase tracking-wider text-primary">
          {label} {required && <span className="text-gold">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-sm font-sans font-medium transition-all ${
            isOpen
              ? 'border-gold ring-2 ring-gold/20 bg-surface-elevated text-primary shadow-glow-gold'
              : 'border-primary/20 bg-surface-elevated text-primary hover:border-gold/50'
          } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="truncate">
            {selectedItem ? (
              <span className="flex items-baseline space-x-2">
                <span>{selectedItem.label}</span>
                {selectedItem.sublabel && (
                  <span className="text-xs text-text-muted font-normal">({selectedItem.sublabel})</span>
                )}
              </span>
            ) : (
              <span className="text-text-muted">{placeholder}</span>
            )}
          </span>
          <ChevronDown className={`h-4 w-4 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-2xl border border-gold/30 bg-surface-card shadow-2xl backdrop-blur-xl animate-scale-up">
            {/* Search Box */}
            <div className="p-3 border-b border-primary/10 flex items-center space-x-2 bg-primary/5 rounded-t-2xl">
              <Search className="h-4 w-4 text-primary ml-1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent py-1 text-xs font-sans text-primary focus:outline-none placeholder:text-text-muted"
                autoFocus
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="p-1 text-text-muted hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Options List */}
            <div ref={listRef} onScroll={handleScroll} className="max-h-64 sm:max-h-72 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 && !isLoading ? (
                <div className="p-4 text-center text-xs font-sans text-text-muted">No matching items found</div>
              ) : (
                filteredItems.map((item) => {
                  const isSelected = item.value === value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        onChange(item.value, item);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-sans font-medium cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-gold/15 text-primary font-bold border border-gold/30'
                          : 'text-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{item.label}</span>
                        {item.sublabel && <span className="text-[11px] text-text-muted">{item.sublabel}</span>}
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-gold" />}
                    </div>
                  );
                })
              )}

              {isLoading && (
                <div className="flex items-center justify-center p-3 text-xs font-sans text-gold space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading options...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
