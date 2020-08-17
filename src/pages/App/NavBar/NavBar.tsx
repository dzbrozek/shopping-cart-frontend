import React, { MouseEvent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useSnackbar } from 'notistack';

import useMe from 'hooks/useMe';
import API from 'api';

import { Title } from './styles';
import LoginDialog from '../LoginDialog';

const NavBar = (): React.ReactElement => {
  const { data: meData, mutate: mutateMe } = useMe();
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
    null,
  );
  const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const isMenuOpen = Boolean(menuAnchorEl);

  const handleMenu = (event: MouseEvent<HTMLElement>): void => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setMenuAnchorEl(null);
  };

  const handleLogOut = async (): Promise<void> => {
    try {
      await API.logOut();
      await mutateMe(null, false);
    } catch (e) {
      enqueueSnackbar('You cannot log out right now', {
        variant: 'error',
      });
    } finally {
      handleMenuClose();
    }
  };

  const handleLoginDialogClose = (): void => {
    setLoginDialogOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Title variant="h6">Shopping Cart</Title>
          {meData ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit">
                <AccountCircleIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}>
                <MenuItem onClick={handleLogOut}>Log out</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" onClick={() => setLoginDialogOpen(true)}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <LoginDialog onClose={handleLoginDialogClose} open={loginDialogOpen} />
    </>
  );
};

export default NavBar;
