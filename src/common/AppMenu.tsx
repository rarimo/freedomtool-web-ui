import { Menu, MenuProps } from '@mui/material'

export default function AppMenu({ anchorEl, children, ...props }: Omit<MenuProps, 'open'>) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      MenuListProps={{
        ...props.MenuListProps,
        sx: { width: ({ spacing }) => spacing(60), ...props.MenuListProps?.sx },
      }}
      {...props}
    >
      {children}
    </Menu>
  )
}
