import { Menu, MenuItem } from '@mui/material'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { cloneElement, ComponentProps, ReactElement, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  trigger: ReactElement
  menuItems: ReactElement[]
} & Omit<Omit<ComponentProps<typeof PopupState>, 'children'>, 'variant'>

export default function UiPopup({ trigger, menuItems, ...rest }: Props) {
  const popupId = useMemo(() => uuidv4(), [])

  return (
    <PopupState {...rest} popupId={popupId} variant='popover'>
      {popupState => (
        <>
          {cloneElement(trigger, bindTrigger(popupState))}

          <Menu
            {...bindMenu(popupState)}
            MenuListProps={{
              sx: {
                p: 0,
              },
            }}
            slotProps={{
              paper: {
                sx: {
                  p: 0,
                },
              },
              root: {
                sx: {
                  p: 0,
                },
              },
            }}
          >
            {menuItems.map((menuItem, idx) => (
              <MenuItem key={idx} onClick={popupState.close}>
                {menuItem}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </PopupState>
  )
}
