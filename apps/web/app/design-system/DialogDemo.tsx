"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions } from "@endoora/ui";

export default function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog example</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Endoora dialog example"
        description="A minimal reusable modal example."
        footer={<DialogActions onCancel={() => setOpen(false)} onConfirm={() => setOpen(false)} />}
      >
        <p>The native dialog traps focus, closes with Escape, and returns focus to the opener.</p>
      </Dialog>
    </>
  );
}
