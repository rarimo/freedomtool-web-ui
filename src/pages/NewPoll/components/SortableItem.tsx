import { DraggableAttributes } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Stack } from '@mui/material'

type UseSortableReturn = Omit<
  ReturnType<typeof useSortable>,
  'setNodeRef' | 'transform' | 'transition'
>

export interface SortableAction {
  draggable: boolean
  attributes: DraggableAttributes
  listeners?: SyntheticListenerMap
}

export default function SortableItem({
  id,
  index,
  children,
}: {
  id: string
  index: number
  children: (args: UseSortableReturn) => React.ReactNode
}) {
  const { setNodeRef, transform, transition, ...rest } = useSortable({
    id,
    data: { sortable: { index } },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Stack ref={setNodeRef} style={style}>
      {children(rest)}
    </Stack>
  )
}
