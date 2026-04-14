"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
};

export const TableRowActions = ({ onEdit, onDelete }: TableRowActionsProps) => (
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
