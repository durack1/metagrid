import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

import Button from '../General/Button';

export type Props = {
  mode:
    | 'horizontal'
    | 'vertical'
    | 'vertical-left'
    | 'vertical-right'
    | 'inline';
  cartItems: number;
};

const RightMenu: React.FC<Props> = ({ mode, cartItems }) => {
  return (
    <div data-testid="right-menu">
      <Menu defaultSelectedKeys={['search']} mode={mode}>
        <Menu.Item key="search">
          <Link to="/search">Search</Link>
        </Menu.Item>
        <Menu.SubMenu
          title={<span className="submenu-title-wrapper">Learn</span>}
          disabled
        >
          <Menu.ItemGroup title="Documentation">
            <Menu.Item key="guide">Guide</Menu.Item>
            <Menu.Item key="api">API</Menu.Item>
          </Menu.ItemGroup>
        </Menu.SubMenu>
        <Menu.Item key="resources" disabled>
          Resources
        </Menu.Item>
        <Menu.Item key="login">
          <Button type="primary" disabled>
            Log In
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Link to="/cart">
            <Button type="link">
              <ShoppingCartOutlined style={{ fontSize: '24px' }} />
              {cartItems}
            </Button>
          </Link>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default RightMenu;
