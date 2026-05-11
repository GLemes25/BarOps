"use client";

import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TableRowActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
};

export const TableRowActions = ({ onEdit, onDelete, onDuplicate }: TableRowActionsProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">Ações</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem onClick={onEdit}>
        <Pencil className="mr-2 h-4 w-4" />
        Editar
      </DropdownMenuItem>
      {onDuplicate && (
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicar Evento
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={onDelete}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Excluir
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
