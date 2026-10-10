import clsx from 'clsx'
import Document from '@tiptap/extension-document'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import 'highlight.js/styles/atom-one-dark.css'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import { forwardRef, useImperativeHandle } from 'react'
import { EMPTY_TITLE_FALLBACK, parseEditorContent } from './parseContent'
import { countWords, getHeadings, HeadingItem } from './getHeadings'
import { useTheme } from '../../contexts/ThemeContext'

export interface OnContentUpdatedParams {
  title: string
  content?: string
}

export interface DocumentStats {
  headings: HeadingItem[]
  wordCount: number
}

export interface EditorHandle {
  /** Rola até o heading na posição `pos` do doc ProseMirror (ver `getHeadings`). */
  scrollToHeading: (pos: number) => void
}

interface EditorProps {
  content: string
  onContentUpdated: (params: OnContentUpdatedParams) => void
  onStatsChanged?: (stats: DocumentStats) => void
}

const lowlight = createLowlight(common)

lowlight.register({ html })
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

/**
 * Nomes amigáveis das linguagens registradas no `lowlight` acima — única
 * fonte de verdade, reaproveitada pela tela de configurações (spec
 * 010i-app-settings) em vez de duplicar essa lista lá.
 */
export const SUPPORTED_CODE_LANGUAGES = [
  'JavaScript',
  'TypeScript',
  'CSS',
  'HTML',
]

export const Editor = forwardRef<EditorHandle, EditorProps>(function Editor(
  { content, onContentUpdated, onStatsChanged },
  ref,
) {
  const { theme } = useTheme()

  const editor = useEditor({
    extensions: [
      Document.extend({
        content: 'heading block*',
      }),
      StarterKit.configure({
        document: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Highlight,
      Typography,
      Placeholder.configure({
        placeholder: ({ node }) =>
          node.type.name === 'heading'
            ? EMPTY_TITLE_FALLBACK
            : 'Escreva algo...',
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-gray-500 before:h-0 before:float-left before:pointer-events-none',
      }),
    ],
    onCreate: ({ editor }) => {
      onStatsChanged?.({
        headings: getHeadings(editor.state.doc),
        wordCount: countWords(editor.state.doc),
      })
    },
    onUpdate: ({ editor }) => {
      const { title, content } = parseEditorContent(
        editor.state.doc,
        editor.schema,
      )

      onContentUpdated({ title, content })
      onStatsChanged?.({
        headings: getHeadings(editor.state.doc),
        wordCount: countWords(editor.state.doc),
      })
    },
    content,
    autofocus: 'start',
    editorProps: {
      attributes: {
        class: 'focus:outline-none',
      },
    },
  })

  useImperativeHandle(
    ref,
    () => ({
      scrollToHeading(pos: number) {
        const dom = editor?.view.nodeDOM(pos)

        if (dom instanceof HTMLElement) {
          dom.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      },
    }),
    [editor],
  )

  return (
    <EditorContent
      editor={editor}
      className={clsx('w-[65ch] prose prose-headings:mt-0', {
        'prose-invert': theme === 'dark',
      })}
      spellCheck="false"
    />
  )
})
