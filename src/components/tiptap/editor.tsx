"use client"
import "@/app/globals.css"
import React from "react"
import StarterKit from "@tiptap/starter-kit"

import { EditorContent, useEditor } from "@tiptap/react"
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus"
import { Dropcursor, Placeholder, Selection } from "@tiptap/extensions"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Superscript from "@tiptap/extension-superscript"
import Subscript from "@tiptap/extension-subscript"
import { QRCodeSVG } from "qrcode.react"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Camera, Copy, Globe, Lock, Share2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"

type NoteEditorProps = {
  qrCode?: string
}

export const NoteEditor = ({ qrCode }: NoteEditorProps) => {
  const [visibility, setVisibility] = React.useState("public")

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "w-full outline-none mx-auto max-w-[720px] py-24",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      Placeholder.configure({
        placeholder: "Write something...",
      }),
      Image,
      Dropcursor,
    ],
    content: `<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`,
  })

  const TOOLS = {
    bold: {
      icon: "B",
      action: () => editor?.chain().focus().toggleBold().run(),
    },
    italic: {
      icon: "I",
      action: () => editor?.chain().focus().toggleItalic().run(),
    },
    strike: {
      icon: "S",
      action: () => editor?.chain().focus().toggleStrike().run(),
    },
  }

  return (
    <>
      <div className="rounded-full bg-secondary absolute top-5 right-5 py-2 border border-border ring-4 ring-muted/50 z-50 px-3 gap-2 flex items-center justify-center">
        {/* Avatar Group */}
        <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale h-max">
          <Avatar className="size-6">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar className="size-6">
            <AvatarImage src="https://github.com/leerob.png" alt="@leerob" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar className="size-6">
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 gap-2 rounded-full">
              <Globe size={20} />
              Visibility
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-2xl">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none font-medium">Change Visibility</h4>
                <p className="text-muted-foreground text-sm">
                  You can share it with friends or turn super secret mode on to
                  keep it private.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full">
                <Label htmlFor="visibility" className="w-full">
                  Visibility
                </Label>
                <Select value={visibility} onValueChange={setVisibility}>
                  <SelectTrigger className="w-full max-w-[180px] rounded-xl">
                    <SelectValue placeholder="Change Visibility" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl w-full max-w-[180px]">
                    <SelectGroup>
                      <SelectItem className="rounded-lg" value="private">
                        <Lock size={16} />
                        Private
                      </SelectItem>
                      <SelectItem className="rounded-lg" value="public">
                        <Globe size={16} />
                        Public
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                disabled={visibility === "private"}
                className="w-full rounded-xl"
              >
                <Share2 size={20} />
                Share
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button className="h-8 gap-2 rounded-full active:scale-[0.98] duration-200 ease-out cursor-pointer">
              <Camera size={20} />
              Snap
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-2xl">
            {qrCode ? (
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="space-y-2">
                  <h4 className="leading-none font-bold text-center">
                    Scan to Sync Note
                  </h4>
                  <p className="text-muted-foreground text-sm text-center">
                    I scanned this QR from your phone so take a picture and sync
                    it with your note.
                  </p>
                </div>
                <QRCodeSVG value={qrCode} />

                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    navigator.clipboard.writeText(qrCode)
                    toast("QR Code link copied to clipboard!")
                  }}
                  className="w-full rounded-xl"
                >
                  <Copy size={20} />
                  Copy Link
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <h4 className="leading-none font-bold text-center">
                  No QR Code Available
                </h4>
                <p className="text-muted-foreground text-sm text-center">
                  Please generate a QR code to <br /> sync your note.
                </p>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {editor && (
        <BubbleMenu className="bubble-menu" editor={editor}>
          <ToggleGroup type="multiple">
            {Object.entries(TOOLS).map(([key, { icon, action }]) => (
              <ToggleGroupItem key={key} value={key} onClick={action}>
                {icon}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </>
  )
}
