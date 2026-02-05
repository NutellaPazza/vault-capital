import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Pool,
  StartupDeal,
  Position,
  MarketplaceListing,
  Transaction,
  Notification,
  PoolWithDeal,
  PositionWithPool,
  ListingWithDetails,
} from '@/types';
import {
  initialUser,
  initialDeals,
  initialPools,
  initialPositions,
  initialListings,
  initialTransactions,
  initialNotifications,
  mockSellerUser,
} from '@/data/mockData';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: User | null;
  
  // Data
  deals: StartupDeal[];
  pools: Pool[];
  positions: Position[];
  listings: MarketplaceListing[];
  transactions: Transaction[];
  notifications: Notification[];
  allUsers: User[];
  
  // Actions - Auth
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  toggleAdmin: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Actions - Wallet
  deposit: (amount: number) => void;
  withdraw: (amount: number) => boolean;
  
  // Actions - Invest
  invest: (poolId: string, amount: number) => boolean;
  
  // Actions - Pool Management (Admin)
  forcePoolStatus: (poolId: string, status: Pool['pool_status']) => void;
  simulateExit: (poolId: string, exitMultiple: number) => void;
  createPool: (deal: StartupDeal, pool: Omit<Pool, 'id' | 'deal_id'>) => void;
  
  // Actions - Marketplace
  createListing: (positionId: string, percentForSale: number, askPrice: number) => void;
  cancelListing: (listingId: string) => void;
  buyListing: (listingId: string) => boolean;
  
  // Actions - Notifications
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  
  // Helpers
  getPoolWithDeal: (poolId: string) => PoolWithDeal | null;
  getPositionsWithPools: () => PositionWithPool[];
  getListingsWithDetails: () => ListingWithDetails[];
  getLivePools: () => PoolWithDeal[];
  getUpcomingPools: () => PoolWithDeal[];
  getActivePools: () => PoolWithDeal[];
  
  // Reset
  resetToInitialState: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 11);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isAdmin: false,
      currentUser: null,
      deals: initialDeals,
      pools: initialPools,
      positions: initialPositions,
      listings: initialListings,
      transactions: initialTransactions,
      notifications: initialNotifications,
      allUsers: [initialUser, mockSellerUser],
      
      // Auth actions
      login: (email, _password) => {
        const user = get().allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (user) {
          set({ isAuthenticated: true, currentUser: user });
          return true;
        }
        // Create new user for demo
        const newUser: User = {
          ...initialUser,
          id: generateId(),
          email,
          name: email.split('@')[0],
        };
        set(state => ({
          isAuthenticated: true,
          currentUser: newUser,
          allUsers: [...state.allUsers, newUser],
        }));
        return true;
      },
      
      signup: (name, email, _password) => {
        const newUser: User = {
          ...initialUser,
          id: generateId(),
          name,
          email,
        };
        set(state => ({
          isAuthenticated: true,
          currentUser: newUser,
          allUsers: [...state.allUsers, newUser],
        }));
        return true;
      },
      
      logout: () => {
        set({ isAuthenticated: false, currentUser: null, isAdmin: false });
      },
      
      toggleAdmin: () => {
        set(state => ({ isAdmin: !state.isAdmin }));
      },
      
      updateUserProfile: (updates) => {
        set(state => {
          if (!state.currentUser) return state;
          const updatedUser = { ...state.currentUser, ...updates };
          return {
            currentUser: updatedUser,
            allUsers: state.allUsers.map(u => u.id === updatedUser.id ? updatedUser : u),
          };
        });
      },
      
      // Wallet actions
      deposit: (amount) => {
        const timestamp = new Date().toISOString();
        set(state => {
          if (!state.currentUser) return state;
          const newTransaction: Transaction = {
            id: generateId(),
            user_id: state.currentUser.id,
            type: 'deposit',
            amount_eur: amount,
            timestamp,
            meta: { notes: 'Deposit' },
          };
          return {
            currentUser: {
              ...state.currentUser,
              wallet_balance_eur: state.currentUser.wallet_balance_eur + amount,
            },
            transactions: [newTransaction, ...state.transactions],
          };
        });
      },
      
      withdraw: (amount) => {
        const state = get();
        if (!state.currentUser || state.currentUser.wallet_balance_eur < amount) {
          return false;
        }
        const timestamp = new Date().toISOString();
        set(state => {
          if (!state.currentUser) return state;
          const newTransaction: Transaction = {
            id: generateId(),
            user_id: state.currentUser.id,
            type: 'withdraw',
            amount_eur: -amount,
            timestamp,
            meta: { notes: 'Withdrawal' },
          };
          return {
            currentUser: {
              ...state.currentUser,
              wallet_balance_eur: state.currentUser.wallet_balance_eur - amount,
            },
            transactions: [newTransaction, ...state.transactions],
          };
        });
        return true;
      },
      
      // Invest actions
      invest: (poolId, amount) => {
        const state = get();
        const pool = state.pools.find(p => p.id === poolId);
        if (!pool || !state.currentUser) return false;
        
        const fee = amount * (pool.fee_entry_percent / 100);
        const total = amount + fee;
        
        if (state.currentUser.wallet_balance_eur < total) return false;
        if (pool.pool_status !== 'live') return false;
        
        const timestamp = new Date().toISOString();
        const deal = state.deals.find(d => d.id === pool.deal_id);
        
        set(state => {
          if (!state.currentUser) return state;
          
          // Check if user already has a position in this pool
          const existingPosition = state.positions.find(
            p => p.pool_id === poolId && p.user_id === state.currentUser!.id
          );
          
          const newRaised = pool.raised_eur + amount;
          const ownershipPercent = (amount / pool.target_eur) * (deal?.offer_equity_percent || 10);
          
          const investTx: Transaction = {
            id: generateId(),
            user_id: state.currentUser.id,
            type: 'invest',
            amount_eur: -amount,
            timestamp,
            meta: { pool_id: poolId, notes: `Investment in ${deal?.startup_name}` },
          };
          
          const feeTx: Transaction = {
            id: generateId(),
            user_id: state.currentUser.id,
            type: 'fee',
            amount_eur: -fee,
            timestamp,
            meta: { pool_id: poolId, notes: `${pool.fee_entry_percent}% entry fee` },
          };
          
          let newPositions = state.positions;
          if (existingPosition) {
            newPositions = state.positions.map(p =>
              p.id === existingPosition.id
                ? {
                    ...p,
                    invested_eur: p.invested_eur + amount,
                    ownership_percent_of_spv: p.ownership_percent_of_spv + ownershipPercent,
                    current_estimated_value_eur: p.current_estimated_value_eur + amount,
                  }
                : p
            );
          } else {
            const newPosition: Position = {
              id: generateId(),
              user_id: state.currentUser.id,
              pool_id: poolId,
              invested_eur: amount,
              ownership_percent_of_spv: ownershipPercent,
              current_estimated_value_eur: amount,
              lockup: false,
              is_listed_on_market: false,
              created_at: timestamp,
            };
            newPositions = [...state.positions, newPosition];
          }
          
          return {
            currentUser: {
              ...state.currentUser,
              wallet_balance_eur: state.currentUser.wallet_balance_eur - total,
            },
            pools: state.pools.map(p =>
              p.id === poolId
                ? { ...p, raised_eur: newRaised, investors_count: p.investors_count + (existingPosition ? 0 : 1) }
                : p
            ),
            positions: newPositions,
            transactions: [feeTx, investTx, ...state.transactions],
          };
        });
        
        return true;
      },
      
      // Admin actions
      forcePoolStatus: (poolId, status) => {
        set(state => {
          const pool = state.pools.find(p => p.id === poolId);
          if (!pool) return state;
          
          // Handle refunds for failed pools
          if (status === 'failed' && pool.pool_status === 'live') {
            const poolPositions = state.positions.filter(p => p.pool_id === poolId);
            const timestamp = new Date().toISOString();
            
            let newTransactions = [...state.transactions];
            let updatedUsers = [...state.allUsers];
            
            poolPositions.forEach(position => {
              const refundTx: Transaction = {
                id: generateId(),
                user_id: position.user_id,
                type: 'pool_refund',
                amount_eur: position.invested_eur,
                timestamp,
                meta: { pool_id: poolId, notes: 'Pool failed - refund' },
              };
              newTransactions = [refundTx, ...newTransactions];
              
              updatedUsers = updatedUsers.map(u =>
                u.id === position.user_id
                  ? { ...u, wallet_balance_eur: u.wallet_balance_eur + position.invested_eur }
                  : u
              );
            });
            
            const currentUser = state.currentUser
              ? updatedUsers.find(u => u.id === state.currentUser!.id) || state.currentUser
              : null;
            
            return {
              pools: state.pools.map(p => p.id === poolId ? { ...p, pool_status: status } : p),
              positions: state.positions.filter(p => p.pool_id !== poolId),
              transactions: newTransactions,
              allUsers: updatedUsers,
              currentUser,
            };
          }
          
          return {
            pools: state.pools.map(p => p.id === poolId ? { ...p, pool_status: status } : p),
          };
        });
      },
      
      simulateExit: (poolId, exitMultiple) => {
        set(state => {
          const pool = state.pools.find(p => p.id === poolId);
          if (!pool || pool.pool_status !== 'active') return state;
          
          const poolPositions = state.positions.filter(p => p.pool_id === poolId);
          const totalInvested = poolPositions.reduce((sum, p) => sum + p.invested_eur, 0);
          const totalProceeds = totalInvested * exitMultiple;
          const profit = totalProceeds - totalInvested;
          const carryFee = profit > 0 ? profit * (pool.fee_carry_percent / 100) : 0;
          const netProceeds = totalProceeds - carryFee;
          
          const timestamp = new Date().toISOString();
          let newTransactions = [...state.transactions];
          let updatedUsers = [...state.allUsers];
          
          poolPositions.forEach(position => {
            const positionShare = position.invested_eur / totalInvested;
            const distribution = netProceeds * positionShare;
            
            const exitTx: Transaction = {
              id: generateId(),
              user_id: position.user_id,
              type: 'exit_distribution',
              amount_eur: distribution,
              timestamp,
              meta: { pool_id: poolId, notes: `Exit at ${exitMultiple}x` },
            };
            newTransactions = [exitTx, ...newTransactions];
            
            updatedUsers = updatedUsers.map(u =>
              u.id === position.user_id
                ? { ...u, wallet_balance_eur: u.wallet_balance_eur + distribution }
                : u
            );
          });
          
          const currentUser = state.currentUser
            ? updatedUsers.find(u => u.id === state.currentUser!.id) || state.currentUser
            : null;
          
          return {
            pools: state.pools.map(p => p.id === poolId ? { ...p, pool_status: 'exit_completed' } : p),
            positions: state.positions.filter(p => p.pool_id !== poolId),
            transactions: newTransactions,
            allUsers: updatedUsers,
            currentUser,
          };
        });
      },
      
      createPool: (deal, poolData) => {
        const dealId = generateId();
        const poolId = generateId();
        
        set(state => ({
          deals: [...state.deals, { ...deal, id: dealId }],
          pools: [...state.pools, { ...poolData, id: poolId, deal_id: dealId }],
        }));
      },
      
      // Marketplace actions
      createListing: (positionId, percentForSale, askPrice) => {
        set(state => {
          const position = state.positions.find(p => p.id === positionId);
          if (!position) return state;
          
          const newListing: MarketplaceListing = {
            id: generateId(),
            seller_user_id: position.user_id,
            pool_id: position.pool_id,
            position_id: positionId,
            percent_of_position_for_sale: percentForSale,
            ask_price_eur: askPrice,
            created_at: new Date().toISOString(),
            status: 'active',
            fee_marketplace_percent: 1.0,
          };
          
          return {
            listings: [...state.listings, newListing],
            positions: state.positions.map(p =>
              p.id === positionId ? { ...p, is_listed_on_market: true } : p
            ),
          };
        });
      },
      
      cancelListing: (listingId) => {
        set(state => {
          const listing = state.listings.find(l => l.id === listingId);
          if (!listing) return state;
          
          return {
            listings: state.listings.map(l =>
              l.id === listingId ? { ...l, status: 'cancelled' as const } : l
            ),
            positions: state.positions.map(p =>
              p.id === listing.position_id ? { ...p, is_listed_on_market: false } : p
            ),
          };
        });
      },
      
      buyListing: (listingId) => {
        const state = get();
        const listing = state.listings.find(l => l.id === listingId && l.status === 'active');
        if (!listing || !state.currentUser) return false;
        
        const fee = listing.ask_price_eur * (listing.fee_marketplace_percent / 100);
        const total = listing.ask_price_eur + fee;
        
        if (state.currentUser.wallet_balance_eur < total) return false;
        if (listing.seller_user_id === state.currentUser.id) return false;
        
        const timestamp = new Date().toISOString();
        const position = state.positions.find(p => p.id === listing.position_id);
        if (!position) return false;
        
        const pool = state.pools.find(p => p.id === listing.pool_id);
        const deal = pool ? state.deals.find(d => d.id === pool.deal_id) : null;
        
        set(state => {
          if (!state.currentUser || !position) return state;
          
          const transferAmount = position.invested_eur * (listing.percent_of_position_for_sale / 100);
          const transferOwnership = position.ownership_percent_of_spv * (listing.percent_of_position_for_sale / 100);
          const transferValue = position.current_estimated_value_eur * (listing.percent_of_position_for_sale / 100);
          
          // Buyer transactions
          const buyTx: Transaction = {
            id: generateId(),
            user_id: state.currentUser.id,
            type: 'market_buy',
            amount_eur: -listing.ask_price_eur,
            timestamp,
            meta: { listing_id: listingId, notes: `Bought ${listing.percent_of_position_for_sale}% of ${deal?.startup_name} position` },
          };
          
          const buyFeeTx: Transaction = {
            id: generateId(),
            user_id: state.currentUser.id,
            type: 'fee',
            amount_eur: -fee,
            timestamp,
            meta: { listing_id: listingId, notes: '1% marketplace fee' },
          };
          
          // Seller transaction
          const sellTx: Transaction = {
            id: generateId(),
            user_id: listing.seller_user_id,
            type: 'market_sell',
            amount_eur: listing.ask_price_eur,
            timestamp,
            meta: { listing_id: listingId, notes: `Sold ${listing.percent_of_position_for_sale}% of position` },
          };
          
          // Update seller's wallet
          let updatedUsers = state.allUsers.map(u =>
            u.id === listing.seller_user_id
              ? { ...u, wallet_balance_eur: u.wallet_balance_eur + listing.ask_price_eur }
              : u
          );
          
          // Check if buyer already has position in this pool
          const existingBuyerPosition = state.positions.find(
            p => p.pool_id === listing.pool_id && p.user_id === state.currentUser!.id
          );
          
          let newPositions = state.positions;
          
          if (listing.percent_of_position_for_sale === 100) {
            // Full transfer
            if (existingBuyerPosition) {
              newPositions = state.positions
                .filter(p => p.id !== listing.position_id)
                .map(p =>
                  p.id === existingBuyerPosition.id
                    ? {
                        ...p,
                        invested_eur: p.invested_eur + transferAmount,
                        ownership_percent_of_spv: p.ownership_percent_of_spv + transferOwnership,
                        current_estimated_value_eur: p.current_estimated_value_eur + transferValue,
                      }
                    : p
                );
            } else {
              newPositions = state.positions.map(p =>
                p.id === listing.position_id
                  ? { ...p, user_id: state.currentUser!.id, is_listed_on_market: false }
                  : p
              );
            }
          } else {
            // Partial transfer
            newPositions = state.positions.map(p =>
              p.id === listing.position_id
                ? {
                    ...p,
                    invested_eur: p.invested_eur - transferAmount,
                    ownership_percent_of_spv: p.ownership_percent_of_spv - transferOwnership,
                    current_estimated_value_eur: p.current_estimated_value_eur - transferValue,
                    is_listed_on_market: false,
                  }
                : p
            );
            
            if (existingBuyerPosition) {
              newPositions = newPositions.map(p =>
                p.id === existingBuyerPosition.id
                  ? {
                      ...p,
                      invested_eur: p.invested_eur + transferAmount,
                      ownership_percent_of_spv: p.ownership_percent_of_spv + transferOwnership,
                      current_estimated_value_eur: p.current_estimated_value_eur + transferValue,
                    }
                  : p
              );
            } else {
              const newPosition: Position = {
                id: generateId(),
                user_id: state.currentUser.id,
                pool_id: listing.pool_id,
                invested_eur: transferAmount,
                ownership_percent_of_spv: transferOwnership,
                current_estimated_value_eur: transferValue,
                lockup: false,
                is_listed_on_market: false,
                created_at: timestamp,
              };
              newPositions = [...newPositions, newPosition];
            }
          }
          
          return {
            currentUser: {
              ...state.currentUser,
              wallet_balance_eur: state.currentUser.wallet_balance_eur - total,
            },
            listings: state.listings.map(l =>
              l.id === listingId ? { ...l, status: 'sold' as const } : l
            ),
            positions: newPositions,
            transactions: [buyFeeTx, buyTx, sellTx, ...state.transactions],
            allUsers: updatedUsers,
          };
        });
        
        return true;
      },
      
      // Notification actions
      markNotificationRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        }));
      },
      
      markAllNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
        }));
      },
      
      // Helper functions
      getPoolWithDeal: (poolId) => {
        const state = get();
        const pool = state.pools.find(p => p.id === poolId);
        if (!pool) return null;
        const deal = state.deals.find(d => d.id === pool.deal_id);
        if (!deal) return null;
        return { ...pool, deal };
      },
      
      getPositionsWithPools: () => {
        const state = get();
        if (!state.currentUser) return [];
        
        return state.positions
          .filter(p => p.user_id === state.currentUser!.id)
          .map(position => {
            const pool = state.pools.find(p => p.id === position.pool_id);
            const deal = pool ? state.deals.find(d => d.id === pool.deal_id) : null;
            if (!pool || !deal) return null;
            return { ...position, pool, deal };
          })
          .filter(Boolean) as PositionWithPool[];
      },
      
      getListingsWithDetails: () => {
        const state = get();
        
        return state.listings
          .filter(l => l.status === 'active')
          .map(listing => {
            const pool = state.pools.find(p => p.id === listing.pool_id);
            const deal = pool ? state.deals.find(d => d.id === pool.deal_id) : null;
            const seller = state.allUsers.find(u => u.id === listing.seller_user_id);
            const position = state.positions.find(p => p.id === listing.position_id);
            if (!pool || !deal || !seller || !position) return null;
            return { ...listing, pool, deal, seller, position };
          })
          .filter(Boolean) as ListingWithDetails[];
      },
      
      getLivePools: () => {
        const state = get();
        return state.pools
          .filter(p => p.pool_status === 'live')
          .map(pool => {
            const deal = state.deals.find(d => d.id === pool.deal_id);
            if (!deal) return null;
            return { ...pool, deal };
          })
          .filter(Boolean) as PoolWithDeal[];
      },
      
      getUpcomingPools: () => {
        const state = get();
        return state.pools
          .filter(p => p.pool_status === 'upcoming')
          .map(pool => {
            const deal = state.deals.find(d => d.id === pool.deal_id);
            if (!deal) return null;
            return { ...pool, deal };
          })
          .filter(Boolean) as PoolWithDeal[];
      },
      
      getActivePools: () => {
        const state = get();
        return state.pools
          .filter(p => p.pool_status === 'active')
          .map(pool => {
            const deal = state.deals.find(d => d.id === pool.deal_id);
            if (!deal) return null;
            return { ...pool, deal };
          })
          .filter(Boolean) as PoolWithDeal[];
      },
      
      resetToInitialState: () => {
        set({
          isAuthenticated: false,
          isAdmin: false,
          currentUser: null,
          deals: initialDeals,
          pools: initialPools,
          positions: initialPositions,
          listings: initialListings,
          transactions: initialTransactions,
          notifications: initialNotifications,
          allUsers: [initialUser, mockSellerUser],
        });
      },
    }),
    {
      name: 'vaultcapital-storage',
    }
  )
);
