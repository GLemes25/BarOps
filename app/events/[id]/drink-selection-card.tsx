"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

type DrinkVariant = { id: number; name: string };

type Props = {
  name: string;
  variants: DrinkVariant[];
  initialSelectedIds: number[];
  onToggle: (variantId: number, isSelected: boolean) => void;
  disabled?: boolean;
};

export const DrinkSelectionCard = ({
  name,
  variants,
  initialSelectedIds,
  onToggle,
  disabled = false,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);

  const hasAnySelected = selectedIds.length > 0;
  const allSelected =
    variants.length > 0 && selectedIds.length === variants.length;

  const handleCardClick = () => {
    if (allSelected) {
      selectedIds.forEach((id) => onToggle(id, true));
      setSelectedIds([]);
    } else {
      const unselected = variants.filter((v) => !selectedIds.includes(v.id));
      unselected.forEach((v) => onToggle(v.id, false));
      setSelectedIds(variants.map((v) => v.id));
    }
  };

  const handleVariantClick = (e: React.MouseEvent, variantId: number) => {
    e.stopPropagation();
    const isSelected = selectedIds.includes(variantId);
    setSelectedIds((prev) =>
      isSelected ? prev.filter((id) => id !== variantId) : [...prev, variantId],
    );
    onToggle(variantId, isSelected);
  };

  return (
    <Card
      className={`cursor-pointer transition-all focus-within:opacity-90 ${
        hasAnySelected ? "bg-primary/10 border-primary" : ""
      }`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{name}</CardTitle>
          {hasAnySelected && (
            <span className="text-xs text-primary">
              {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "selecionada" : "selecionadas"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = selectedIds.includes(variant.id);
            return (
              <Button
                key={variant.id}
                size="sm"
                disabled={disabled}
                onClick={(e) => handleVariantClick(e, variant.id)}
                variant={isSelected ? "default" : "outline"}
                className={`focus-visible:opacity-90 focus-visible:outline-none ${
                  isSelected ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {variant.name}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
