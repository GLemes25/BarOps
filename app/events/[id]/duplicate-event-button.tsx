"use client";

import { duplicateEvent } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  eventId: number;
};

export function DuplicateEventButton({ eventId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async () => {
    setLoading(true);
    const result = await duplicateEvent(eventId);
    setLoading(false);
    if (!result.success || !result.data) {
      toast.error("Não foi possível duplicar o evento.");
    } else {
      toast.success("Evento duplicado!");
      router.push(`/events?edit=${result.data.newEventId}`);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={loading}>
      <Copy className="mr-2 h-4 w-4" />
      {loading ? "Duplicando..." : "Duplicar"}
    </Button>
  );
}
