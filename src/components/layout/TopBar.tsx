import { Link, useLocation } from 'react-router-dom';
import { Bell, Settings, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/appStore';
import { formatCompactCurrency } from '@/lib/formatters';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const TopBar = () => {
  const location = useLocation();
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead, isAdmin, toggleAdmin } = useAppStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const isPublicPage = ['/', '/login', '/signup'].includes(location.pathname);

  if (isPublicPage) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">V</span>
            </div>
            <span className="text-lg font-semibold">VaultCapital</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">V</span>
          </div>
          <span className="text-lg font-semibold">VaultCapital</span>
        </Link>
        
        <div className="flex items-center gap-1">
          {/* Wallet Balance */}
          {currentUser && (
            <Link to="/wallet">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Wallet className="h-4 w-4" />
                <span className="font-medium">{formatCompactCurrency(currentUser.wallet_balance_eur)}</span>
              </Button>
            </Link>
          )}
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between border-b px-3 py-2">
                <span className="font-medium">Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 text-xs text-primary"
                    onClick={markAllNotificationsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.slice(0, 5).map(notification => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3"
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.message}</span>
                  </DropdownMenuItem>
                ))}
                {notifications.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Settings */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/wallet">Wallet</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleAdmin}>
                {isAdmin ? 'Exit Admin Mode' : 'Enable Admin Mode'}
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link to="/admin">Admin Panel</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
