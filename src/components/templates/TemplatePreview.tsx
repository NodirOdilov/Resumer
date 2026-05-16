"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DocumentTemplate } from "@/types/template";

interface TemplatePreviewProps {
  template: DocumentTemplate;
  isOpen: boolean;
  onClose: () => void;
  basePath?: string;
}

export function TemplatePreview({
  template,
  isOpen,
  onClose,
  basePath = "/resume-builder",
}: TemplatePreviewProps) {
  const [selectedColorScheme, setSelectedColorScheme] = useState(
    template.defaultColorScheme
  );

  if (!isOpen) return null;

  const currentScheme = template.colorSchemes.find(
    (cs) => cs.id === selectedColorScheme
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-600" />
          <span className="sr-only">Close preview</span>
        </button>

        <div className="flex-1 overflow-y-auto bg-gray-100 p-8">
          <div className="mx-auto max-w-md">
            {template.thumbnail ? (
              <img
                src={template.thumbnail}
                alt={`${template.name} full preview`}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="aspect-[3/4] w-full rounded-lg bg-white p-8 shadow-lg">
                <div className="space-y-3">
                  <div
                    className="h-4 w-2/3 rounded"
                    style={{ backgroundColor: currentScheme?.primaryColor || "#0D47A1" }}
                  />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-5/6 rounded bg-gray-200" />
                  <div className="h-2 w-4/5 rounded bg-gray-200" />
                  <div className="mt-6 h-3 w-1/2 rounded bg-gray-300" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-5/6 rounded bg-gray-200" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-3/4 rounded bg-gray-200" />
                  <div className="mt-6 h-3 w-1/2 rounded bg-gray-300" />
                  <div className="h-2 w-full rounded bg-gray-200" />
                  <div className="h-2 w-4/5 rounded bg-gray-200" />
                  <div className="h-2 w-5/6 rounded bg-gray-200" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col border-t bg-white p-6 md:w-80 md:border-l md:border-t-0">
          <h2 className="text-xl font-bold text-gray-900">{template.name}</h2>
          <p className="mt-2 text-sm text-gray-500">{template.description}</p>

          {template.colorSchemes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700">Color Scheme</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {template.colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    type="button"
                    onClick={() => setSelectedColorScheme(scheme.id)}
                    className={cn(
                      "h-8 w-8 rounded-full border-2 transition-all",
                      selectedColorScheme === scheme.id
                        ? "border-[#0D47A1] ring-2 ring-[#0D47A1]/30"
                        : "border-gray-200 hover:border-gray-400"
                    )}
                    style={{ backgroundColor: scheme.primaryColor }}
                    title={scheme.name}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Category</span>
              <span className="font-medium capitalize text-gray-900">{template.category}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Rating</span>
              <span className="font-medium text-gray-900">{template.rating.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Reviews</span>
              <span className="font-medium text-gray-900">{template.reviewCount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <Button asChild size="lg" className="w-full">
              <Link href={`${basePath}?template=${template.slug}&color=${selectedColorScheme}`}>
                Use this template
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
