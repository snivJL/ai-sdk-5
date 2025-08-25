"use client";

import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { useSidebar } from "../ui/sidebar";
import { Dispatch, memo, SetStateAction } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import type { Session } from "next-auth";
import equal from "fast-deep-equal";
import { Separator } from "../ui/separator";
import { AttachmentDisplay } from "./attachment-display";
import { PlusIcon } from "lucide-react";
import { SidebarToggle } from "../sidebar/sidebar-toggle";

function PureChatHeader({
  chatId,
  selectedModelId,
  session,
  attachments,
  setAttachments,
}: {
  chatId: string;
  selectedModelId: string;
  session: Session;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
}) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push("/");
                router.refresh();
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}
      <>
        {/* <ModelSelector session={session} selectedModelId={"CRM-connector"} /> */}
      </>
      {attachments.length > 0 && (
        <>
          <Separator orientation="vertical" className="h-6" />
          {/* <AttachmentDisplay
            attachments={attachments}
            setAttachments={setAttachments}
            className="flex-1 min-w-0"
          /> */}
        </>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  if (!equal(prevProps.attachments, nextProps.attachments)) return false;

  return prevProps.selectedModelId === nextProps.selectedModelId;
});
